# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Repository Overview

This is an Obsidian vault template designed to provide a preconfigured setup for new Obsidian vaults. It includes essential plugins, CSS snippets, templates, and a modular system using Git submodules for reusable components.

## Core Architecture

### Git Submodules System
- **`.obsidian/js`** - Contains JavaScript automation scripts as a Git submodule from `github.com/lvnacy-obsidian/scripts`
- The repository uses Git submodules to create a modular note-taking system where components can be shared across different vaults

### Key Components
- **Templates** (`templates/`) - Preconfigured note templates including daily notes and library records
- **Plugin References** (`plugin-reference/`) - Cheat sheets and documentation for Dataview, Templater, and Callouts
- **CSS Snippets** (`.obsidian/snippets/`) - Custom styling for author callouts, multicolumn notes, folder headers, and paragraph writing
- **Assets** (`assets/`) - Brand assets and visual elements

### Obsidian Configuration
- **Core Plugins**: File explorer, search, graph view, daily notes, templates, bookmarks, canvas, and more
- **Community Plugins**: Dataview, custom sorting, iconize, PDF++, minimal theme settings, folder notes, style settings, kanban, color palette
- **Theme**: Minimal theme with custom CSS extensions

## Common Development Tasks

### Working with Git Submodules
```bash
# Initialize submodules when cloning
git submodule update --init --recursive

# Update submodules to latest
git submodule update --remote

# Add new submodule
git submodule add <repository-url> <path>
```

### CSS Snippet Development
```bash
# CSS snippets are located in .obsidian/snippets/
# Enable/disable in Obsidian settings under Appearance > CSS snippets
```

### Template Management
- Templates are stored in `templates/` directory
- Configure template location in Obsidian settings under Core Plugins > Templates
- Use Templater plugin for advanced template functionality with JavaScript

### JavaScript Automation
- Scripts are managed in the `.obsidian/js/` submodule
- Templater scripts for creating articles, editions, and utility functions; these are in progress to be migrated away from Templater to Codescript Toolkit
- Service utilities for note management and structure operations
- Additional context for JavaScript Automation:
	- https://docs.obsidian.md
	- https://github.com/mnaoumov/obsidian-codescript-toolkit

## Development Workflow

### Setting Up New Vault
1. Clone this template repository
2. Initialize Git submodules: `git submodule update --init --recursive`
3. Open in Obsidian and enable community plugins
4. Customize theme and plugin settings as needed

### Modifying Scripts
1. Navigate to `.obsidian/js/` directory
2. Make changes to JavaScript files
3. Commit and push changes to the scripts submodule repository
4. Update submodule reference in main repository

### Adding New CSS Snippets
1. Create new `.css` file in `.obsidian/snippets/`
2. Add proper snippet headers with name, description, version, and author
3. Enable in Obsidian settings
4. Document in `plugin-reference/plugin-reference.md` with attribution

### Plugin Reference Updates
- Maintain cheat sheets in `plugin-reference/` for commonly used plugins
- Include source attribution and links to original documentation
- Update when plugins receive major version changes

## File Structure Notes

- **Overview and guidelines** files at root provide project documentation
- **Assets** directory contains branding elements (LVNACY emblem, YouTube banner)
- **CSS snippets** follow community attribution standards with proper headers
- **JavaScript files** are organized by function (templater, services, utilities)
