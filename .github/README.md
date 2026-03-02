<div align="center">
    <br>
    <a href='https://github.com/ephemeralrogue'>
        <img
            src="./assets/lvnacy_emblem_plain.png"
            alt="Gray banner with bold v in the center"
            width='256px'
        />
    </a>
    <br>
    <br>
    <h1>Obsidian Vault Template</h1>
    A Preconfigured Obsidian Vault<br>
</div>
<div align="center">
    •
    <a href="https:////github.com/ephemeralrogue">
        GitHub
    </a>
    • L V N A C Y •
    <a href="https://bsky.app/profile/lvnacy.xyz">
        Bluesky
    </a>
    •
</div>
<br>
<br>
<a id='contents'></a>
<div align='center'>
    <h1>The LVNACY Apparatus</h1>
</div>

A modular Obsidian vault system designed for scalable, compartmentalized project management. The Apparatus enables you to maintain context-specific vaults while sharing components across installations through Git submodules.
<br>
<br>

## Table of Contents

1. [What is the Apparatus?](#what)
2. [Why Modular Architecture?](#why)
3. [Core Components](#components)
4. [Module System](#modules)
5. [Getting Started](#getting-started)
6. [Development](#development)

<br>
<br>
<a id='what'></a>
<div align='center'>
    <h1>What is the Apparatus?</h1>
</div>

The LVNACY Apparatus is a preconfigured Obsidian vault system that combines essential plugins, CSS snippets, templates, and automation scripts into a cohesive framework. It's built around the principle that managing information across multiple specialized projects requires both consistency and flexibility.

The Apparatus philosophy recognizes that you may be working with different types of content—-stories, research libraries, project documentation, knowledge bases—-each with its own workflow and structure. Rather than forcing everything into a single vault configuration, the Apparatus allows you to spin up context-specific vaults quickly while maintaining the ability to share libraries and components across installations.

[Back to the top](#contents)

<br>
<br>
<a id='why'></a>
<div align='center'>
    <h1>Why Modular Architecture?</h1>
</div>

### Independent Version Control
Each module maintains its own git repository and version control history. This separation means you can track changes specific to each module without cluttering the main vault's history. Updates to one module don't affect others.

### Portability & Reusability
Modules are self-contained units that can be easily shared, moved, or reused across different Apparatus vaults. A module that works in one vault will work in another without modification. You can maintain multiple specialized vaults while reusing common infrastructure.

### Scalability
The compartmentalization model allows the Apparatus ecosystem to grow organically. Different module types—for story development, research libraries, documentation, image management—can be added independently without affecting existing modules or the core vault structure.

### Clean Separation of Concerns
Context-specific notes remain siloed in their respective vaults while shared resources (libraries, references, assets) are managed as independent modules via git submodules.

[Back to the top](#contents)

<br>
<br>
<a id='components'></a>
<div align='center'>
    <h1>Core Components</h1>
</div>

### Essential Plugins
- [Dataview][dataview] - Query and visualize data within your vault
- [Templater][templater] - Advanced template functionality with JavaScript support
- [Custom File Explorer Sort][sortspec] - Organize file explorer with custom rules
- [Longform][longform] - Writing and editing support for long-form content
- [PDF++][pdfplus] - Enhanced PDF document support
- [Folder Notes][folder-notes] - Create notes at the folder level
- [Iconic][icons] - Add icons to files and folders for visual navigation
- [Style Settings][style-settings] - Unified settings interface for theme and plugins

### Automation & Scripting
- JavaScript automation scripts for templating and project scaffolding
- [Templater][templater] integration for dynamic content generation
- Service utilities for note management and vault structure operations
- [Codescript Toolkit][codescript] support for extending functionality

### Custom Styling
- CSS snippets for advanced layout and visual customization
- Author callout styling
- Multicolumn note layouts
- Folder header enhancements
- Paragraph writing formatting

### Documentation & References
- Dataview cheatsheet and reference materials
- Templater user guide and function reference
- Callout style reference for consistent visual communication
- Plugin-specific documentation for quick access

[Back to the top](#contents)

<br>
<br>
<a id='modules'></a>
<div align='center'>
    <h1>Module System</h1>
</div>

Modules are installed as Git submodules within an Apparatus vault. Each module can contain specialized scaffolding, templates, and tools for its particular purpose.

### Available Modules

#### Story Module
Provides complete scaffolding and workflow for creative writing projects. Includes:
- Project specification and planning structure
- Editorial workflow with revision phases
- Scene management and progress tracking
- Integration with [Longform][longform] plugin for manuscript organization
- Dashboard views for tracking editorial progress

### Creating Modules

To create a new module, see [Installing Modules](#installing-modules) below.

> [!warning]
> The module system relies heavily on Git submodules. If unfamiliar with submodules, see the [Git submodules documentation][submodules].

[Back to the top](#contents)

<br>
<br>
<a id='getting-started'></a>
<div align='center'>
    <h1>Getting Started</h1>
</div>

### Setting Up a New Apparatus Vault

1. Start with the [Apparatus Vault Template][apparatus-template]
2. Clone the repository:
   ```bash
   git clone https://github.com/lvnacy-notes/apparatus-vault-template.git
   cd apparatus-vault-template
   ```

3. Initialize Git submodules:
   ```bash
   git submodule update --init --recursive
   ```

4. Open the vault in Obsidian
5. Enable community plugins in settings
6. Customize theme and plugin settings as needed

### Installing Modules

To add a module to your vault:

1. Navigate to https://github.com/lvnacy-notes/apparatus-module.git and use the template to generate a new repository.
2. Run the following command to add your new module to your Apparatus vault:

```bash
git submodule add git@github.com:[you-username]/[your-module-name].git
```

3. Generate scaffolding from a module:  

    A. Ensure the module README is open in your editor  
    B. Use the Templater command palette  
    C. Select `Templater: Open insert template modal`  
    D. Choose the desired scaffold template  

[Back to the top](#contents)

<br>
<br>
<a id='development'></a>
<div align='center'>
    <h1>Development & Contribution</h1>
</div>

### Working with Git Submodules

Update all submodules to their latest versions:
```bash
git submodule update --remote
```

Clone with all submodules initialized:
```bash
git clone --recurse-submodules https://github.com/lvnacy-notes/apparatus-vault-template.git
```

### Creating New CSS Snippets

1. Create a new `.css` file in `.obsidian/snippets/`
2. Include proper attribution headers with name, description, version, and author
3. Enable in Obsidian settings under Appearance > CSS snippets
4. Document the snippet in your plugin reference materials

### Modifying Scripts

1. Navigate to `.obsidian/js/` or your scripts directory
2. Edit JavaScript files as needed
3. Test changes in your vault
4. Commit and push changes to the scripts submodule repository
5. Update the main vault's submodule reference

### Resources

- [Obsidian Documentation][obsidian-docs]
- [Codescript Toolkit Documentation][codescript]
- Included plugin reference materials in `obsidian tooling reference/`

[Back to the top](#contents)

<br>
<br>
<div align='center'>
    <h1>License & Attribution</h1>
</div>

The LVNACY Apparatus is released under the MIT License. See individual modules and components for specific attribution and licensing information.

Included CSS snippets are used with proper attribution to their original authors from the Obsidian community.

[Back to the top](#contents)

<!-- Links -->
[minimal]: https://github.com/kepano/obsidian-minimal
[minimal-settings]: https://github.com/kepano/obsidian-minimal-settings
[dataview]: https://github.com/blacksmithgu/obsidian-dataview
[dataview-cheatsheet]: https://github.com/ephemeralrogue/dataview-cheatsheet
[dataview-cs-orig]: https://github.com/seburbandev/obsidian-dataview-cheatsheet
[templater-cheatsheet]: https://github.com/Ambi93/Obsidian-Sync/blob/main/Comprehensive%20User%20Guide%20for%20Templater%20in%20Obsidian.md
[callout-post]: https://forum.obsidian.md/t/all-callout-styles-for-reference/36102
[sortspec]: https://github.com/SebastianMC/obsidian-custom-sort
[longform]: https://github.com/kevboh/longform
[icons]: https://github.com/gfxholo/iconic
[pdfplus]: https://github.com/RyotaUshio/obsidian-pdf-plus
[note-defs]: https://github.com/dominiclet/obsidian-note-definitions
[frontmatter-links]: https://github.com/mnaoumov/obsidian-frontmatter-markdown-links
[tasks]: https://github.com/obsidian-tasks-group/obsidian-tasks
[templater]: https://github.com/SilentVoid13/Templater
[kanban]: https://github.com/mgmeyers/obsidian-kanban
[folder-notes]: https://github.com/LostPaul/obsidian-folder-notes
[style-settings]: https://github.com/mgmeyers/obsidian-style-settings
[submodules]: https://git-scm.com/book/en/v2/Git-Tools-Submodules
[library]: https://github.com/lvnacy-obsidian/obsidian-library-module
[apparatus-template]: https://github.com/lvnacy-notes/apparatus-vault-template
[apparatus-module-template]: https://github.com/lvnacy-notes/apparatus-module
[codescript]: https://github.com/mnaoumov/obsidian-codescript-toolkit
[obsidian-docs]: https://docs.obsidian.md
[bluesky]: https://bsky.app/profile/lvnacy.xyz
[discord]: https://discord.gg/nh7mqGEfbw
[seburbandev]: https://github.com/seburbandev
[ambi93]: https://github.com/Ambi93
[wendystraite]: https://github.com/wendystraite
