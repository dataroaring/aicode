# Release Notes Generation Prompt Template

## Usage
Use this prompt to generate comprehensive release notes for Apache Doris versions.

## Prompt Template

```
Generate comprehensive release notes for Apache Doris version {VERSION}.

Follow these steps:
1. Auto-detect the previous version using: `git tag --list | grep -E "^{MAJOR}.{MINOR}." | sort -V | grep -B1 "{VERSION}" | head -1`
2. Get the target version tag (use latest RC if final tag doesn't exist): `git tag --list | grep -E "^{VERSION}" | sort -V | tail -1`
3. Get all commits between versions: `git log --pretty=format:"%s" {PREV_VERSION}..{TARGET_VERSION}`

Structure the release notes with these sections:

## Required Sections:
- **Overview**: Brief summary of the release focus
- **New Features**: Features marked with [feat], [feature], [Feature]
- **Improvements**: Performance optimizations marked with [opt], [improvement], [enhance], [Enhancement]
- **Behavior Changes**: Configuration changes, default value changes, breaking changes
- **Critical Bug Fixes**: Important fixes marked with [fix], [Fix], [bug], [Bug]
- **Infrastructure & Development**: Build, dependencies, testing improvements
- **Compatibility Notes**: Backward compatibility information
- **Upgrade Instructions**: Step-by-step upgrade process
- **Known Issues**: Any limitations or known problems

## Commit Categorization Rules:
- **[feat], [feature], [Feature]** → New Features
- **[fix], [Fix], [bug], [Bug]** → Critical Bug Fixes  
- **[opt], [improvement], [enhance], [Enhancement], [Improvement]** → Improvements
- **[chore], [refactor], [test]** → Infrastructure & Development
- **[config], default changes, breaking** → Behavior Changes

## Content Guidelines:
- Group related commits by functional area (cloud, nereids, load, etc.)
- Include PR numbers for traceability
- Focus on user-facing changes and impacts
- Highlight critical fixes and security updates
- Note performance improvements with context
- Explain behavior changes and their implications
- Provide clear upgrade instructions
- Maintain professional, concise language

## Format Requirements:
- Use markdown formatting
- Include bullet points with commit prefixes
- Add PR numbers in parentheses: (#12345)
- Group commits logically within sections
- Use consistent formatting throughout
```

## Example Usage

For version 3.0.8:
```bash
# 1. Auto-detect previous version
PREV_VERSION=$(git tag --list | grep -E "^3\.0\." | sort -V | grep -B1 "3.0.8" | head -1)
# Result: 3.0.7-rc01

# 2. Find target version  
TARGET_VERSION=$(git tag --list | grep -E "^3\.0\.8" | sort -V | tail -1)
# Result: 3.0.8-rc02 (if 3.0.8 final doesn't exist)

# 3. Get commits
git log --pretty=format:"%s" 3.0.7-rc01..3.0.8-rc02
```

## Automation Script Template

```bash
#!/bin/bash

VERSION=$1
if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

# Extract major.minor from version
MAJOR_MINOR=$(echo $VERSION | cut -d'.' -f1,2)

# Auto-detect previous version
PREV_VERSION=$(git tag --list | grep -E "^${MAJOR_MINOR}\." | sort -V | grep -B1 "$VERSION" | head -1)

# Find target version (use RC if final doesn't exist)
TARGET_VERSION=$(git tag --list | grep -E "^${VERSION}" | sort -V | tail -1)

if [ -z "$TARGET_VERSION" ]; then
    echo "Error: No tags found for version $VERSION"
    exit 1
fi

echo "Generating release notes for $VERSION"
echo "Previous version: $PREV_VERSION"  
echo "Target version: $TARGET_VERSION"
echo ""

# Get commits
git log --pretty=format:"%s" ${PREV_VERSION}..${TARGET_VERSION} > commits_${VERSION}.txt

echo "Commits saved to commits_${VERSION}.txt"
echo "Use the commits to generate structured release notes following the template."
```

## Notes
- Always verify the auto-detected previous version is correct
- Check if the final release tag exists before using RC versions
- Review all commits to ensure nothing critical is missed
- Test upgrade instructions before publishing
- Update known issues based on recent bug reports