/**
 * Story Project Generator for the LVNACY Obsidian Apparatus
 * 
 * This module automates the creation of a comprehensive multi-stage story project
 * structure for fiction writing and editing workflows. It scaffolds a complete
 * editorial pipeline from initial serial draft through final publication.
 * 
 * PROCESS OVERVIEW:
 * 
 * 1. FOLDER STRUCTURE CREATION
 *    - Creates hierarchical folder structure for all editorial stages
 *    - Establishes separate Longform projects for each revision stage
 *    - Generates stage-specific folder notes with Longform configurations
 * 
 * 2. EDITORIAL STAGES GENERATED
 *    - serial-draft: Initial serialized drafting with publication tracking
 *    - reassembly: Consolidation of serial chapters into thematic scenes
 *    - 1st-edit: Developmental editing pass (narrative arc, structure)
 *    - 2nd-edit: Copy editing and continuity verification
 *    - 3rd-edit: Line editing and prose polish
 *    - final: Publication-ready version
 * 
 * 3. PROJECT SPECIFICATION
 *    - Creates master project note with comprehensive frontmatter
 *    - Generates progress dashboards with Dataview queries
 *    - Establishes scene lineage tracking across stages
 *    - Provides editorial workflow documentation
 * 
 * DEPENDENCIES:
 * - Obsidian Templater plugin (tp object)
 * - Obsidian Dataview plugin (for generated queries)
 * - Obsidian Longform plugin (for draft management)
 * - Obsidian Custom File Explorer sorting plugin (recommended)
 * 
 * @module newStoryProject
 * @since 2024
 * @requires templater
 */

/**
 * Main entry point for story project generation.
 * 
 * Creates a complete multi-stage editorial structure including folders,
 * configuration files, and a master project specification with tracking
 * dashboards. Each stage is configured as an independent Longform project.
 * 
 * @async
 * @function newStoryProject
 * @param {Object} tp - Templater plugin API object
 * @param {Object} tp.file - File operations API
 * @param {Object} tp.app - Obsidian app instance
 * @param {Object} tp.app.vault - Vault operations API
 * @returns {Promise<void>}
 * 
 * @example
 * // Called via Templater in Obsidian
 * // Creates structure in current folder context
 * await tp.user.newStoryProject(tp);
 */
module.exports = async function newStoryProject(tp) {

	/** generate editorial revision structure */

	// create folders for shitty first draft and editorial revisions
	const storyName = await tp.file.folder();
	const storyNameNoSpaces = storyName.replace(/\s+/g, '-').toLowerCase();
	const path = await tp.file.folder(true);

	const storyFolderNote = await tp.file.create_new(
		'',
		storyName,
		false,
		path
	);

	// set up serial draft
	const serialDraft = await tp.app.vault.createFolder(`${ path }/serial-draft`);
	const serialDraftContent = serialDraftTemplate(tp, { storyName, storyNameNoSpaces });
	const serialDraftNote = await tp.file.create_new(
		serialDraftContent,
		'serial-draft',
		false,
		serialDraft
	);
	console.log(`Created serial draft note at ${ serialDraftNote }`);

	// set up reassembly draft
	const reassembly = await tp.app.vault.createFolder(`${ path }/reassembly`);
	const reassemblyContent = reassemblyDraftTemplate(tp, { storyName, storyNameNoSpaces });
	const reassemblyNote = await tp.file.create_new(
		reassemblyContent,
		'reassembly',
		false,
		reassembly
	);
	console.log(`Created reassembly draft note at ${ reassemblyNote }`);

	// set up 1st-edit
	const firstEdit = await tp.app.vault.createFolder(`${ path }/1st-edit`);
	const firstEditContent = firstEditTemplate(tp, { storyName, storyNameNoSpaces });
	const firstEditNote = await tp.file.create_new(
		firstEditContent,
		'1st-edit',
		false,
		firstEdit
	);
	console.log(`Created 1st-edit note at ${ firstEditNote }`);

	// set up 2nd-edit
	const secondEdit = await tp.app.vault.createFolder(`${ path }/2nd-edit`);
	const secondEditContent = secondEditTemplate(tp, { storyName, storyNameNoSpaces });
	const secondEditNote = await tp.file.create_new(
		secondEditContent,
		'2nd-edit',
		false,
		secondEdit
	);
	console.log(`Created 2nd-edit note at ${ secondEditNote }`);

	// set up 3rd-edit
	const thirdEdit = await tp.app.vault.createFolder(`${ path }/3rd-edit`);
	const thirdEditContent = thirdEditTemplate(tp, { storyName, storyNameNoSpaces });
	const thirdEditNote = await tp.file.create_new(
		thirdEditContent,
		'3rd-edit',
		false,
		thirdEdit
	);
	console.log(`Created 3rd-edit note at ${ thirdEditNote }`);

	// set up final
	const final = await tp.app.vault.createFolder(`${ path }/final`);
	const finalEditContent = finalEditTemplate(tp, { storyName, storyNameNoSpaces });
	const finalEditNote = await tp.file.create_new(
		finalEditContent,
		'final',
		false,
		final
	);
	console.log(`Created final edit note at ${ finalEditNote }`);

	const options = {
		serialDraftNote,
		reassemblyNote,
		firstEditNote,
		secondEditNote,
		thirdEditNote,
		finalEditNote,
		storyName
	}

	const storySpecContent = storyProjectSpec(tp, options);

	await tp.app.vault.append(
		storyFolderNote,
		storySpecContent
	);

}

/**
 * Generates the master project specification document content.
 * 
 * Creates a comprehensive markdown document with YAML frontmatter containing
 * project metadata, stage links, and multiple Dataview-powered dashboards for
 * tracking scene progress, editorial status, and revision history.
 * 
 * @function storyProjectSpec
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Project configuration options
 * @param {Object} options.serialDraftNote - Serial draft note file reference
 * @param {Object} options.reassemblyNote - Reassembly draft note file reference
 * @param {Object} options.firstEditNote - First edit note file reference
 * @param {Object} options.secondEditNote - Second edit note file reference
 * @param {Object} options.thirdEditNote - Third edit note file reference
 * @param {Object} options.finalEditNote - Final edit note file reference
 * @param {string} options.storyName - Story project name
 * @returns {string} Markdown content with frontmatter and dashboards
 */
function storyProjectSpec(tp, options) {
	const {
		serialDraftNote,
		reassemblyNote,
		firstEditNote,
		secondEditNote,
		thirdEditNote,
		finalEditNote,
		storyName
	} = options;
	const storyNameNoSpaces = storyName.replace(/\s+/g, '-').toLowerCase();

	return `---
class: story
category:
series:
title: ${ storyName }
created:
updated:
stage:
stage-status:
serial-draft: '[[${ serialDraftNote.basename }]]'
reassembly: '[[${ reassemblyNote.basename }]]'
1st-edit: '[[${ firstEditNote.basename }]]'
2nd-edit: '[[${ secondEditNote.basename }]]'
3rd-edit: '[[${ thirdEditNote.basename }]]'
final: '[[${ finalEditNote.basename }]]'
published: false
apple-books:
barnes-noble:
cover:
cover-alt-text:
book-blurb:
pdf:
epub:
sorting-spec: |-
  serial-draft
  reassembly
  %
  images
  ARCHIVE
  AGENTS
  ${ storyNameNoSpaces }
tags:
  - ${ storyNameNoSpaces }
---

# contents

\`\`\`toc
\`\`\`

# progress dashboard

## stage completion

**Stage Completion Status:**
\`\`\`dataviewjs
const stages = ["serial-draft", "reassembly", "1st-edit", "2nd-edit", "3rd-edit", "final"];
const allScenes = dv.pages("#${ storyNameNoSpaces }").where(p => \`\${ p.class }\`.includes("scene"));
for (let stage of stages) {
	const scenes = allScenes.where(p => \`\${ p.stage }\`.includes(stage));
	const total = scenes.length;
	const approved = scenes.where(p => p["stage-status"] === "approved").length;
	const inProgress = scenes.where(p => p["stage-status"] === "in-progress").length;
	const needsRevision = scenes.where(p => p["stage-status"] === "needs-revision").length;
	const percent = total > 0 ? Math.round((approved / total) * 100) : 0;
	dv.paragraph(\`**\${ stage }**: \${approved}/\${total} approved (\${percent}%) | \${inProgress} in-progress | \${needsRevision} needs revision\`);
}
\`\`\`

## scene status by stage

**All Scenes Across Stages:**
\`\`\`dataview
TABLE WITHOUT ID
	file.link as Scene,
	chapter as "Ch",
	stage as Stage,
	stage-status as Status,
	updated as "Last Edit"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene")
SORT
	stage asc, chapter asc
\`\`\`

## scene lineage

### serial draft reassembly

**Reassembly Scene Mapping to Serial-Draft Chapters:**
\`\`\`dataview
TABLE WITHOUT ID
	file.link as "Reassembly Scene",
	context as "Serial Chapters",
	stage-status as Status
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "reassembly")
SORT
	file.name ASC
\`\`\`

**Serial Chapters Mapped to Reassembly Scenes:**
\`\`\`dataview
TABLE WITHOUT ID
	serial as "Serial Ch",
	rows.file.link as "Reassembly Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "reassembly") AND
	context
FLATTEN
	context as serial
GROUP BY
	serial
SORT
	serial ASC
\`\`\`

### cross-stage lineage

#### Reassembly → 1st-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "Reassembly Scene",
	rows.file.link as "1st-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "1st-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

#### 1st-edit → 2nd-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "1st-edit Scene",
	rows.file.link as "2nd-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "2nd-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

#### 2nd-edit → 3rd-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "2nd-edit Scene",
	rows.file.link as "3rd-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "3rd-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

## recent activity

**Recently Modified Scenes:**
\`\`\`dataview
TABLE WITHOUT ID
	file.link as Scene,
	stage as Stage,
	chapter as "Ch",
	stage-status as Status,
	updated as "Last Modified"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene")
SORT
	updated DESC
LIMIT 10
\`\`\`

## unresolved editorial notes

**Scenes Needing Attention:**
\`\`\`dataview
TABLE WITHOUT ID
	file.link as Scene,
	stage as Stage,
	stage-status as Status,
	editorial-notes as "Outstanding Issues"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	(
		contains(stage, "reassembly") OR
		contains(stage, "1st-edit") OR
		contains(stage, "2nd-edit")
	) AND
	(
		contains(stage-status, "needs-revision") OR
		editorial-notes
	)
SORT
	stage ASC, chapter ASC
\`\`\`

## inline comment tracking

**Scenes with Editorial Comments (ME tag):** 
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p =>
		\`\${p.stage}\`.includes("reassembly") ||
		\`\${p.stage}\`.includes("1st-edit") ||
		\`\${p.stage}\`.includes("2nd-edit") ||
		\`\${p.stage}\`.includes("3rd-edit")
	);

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("<!-- ME:")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

**Scenes with Unresolved Comments:**
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("reassembly"));

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("[UNRESOLVED]")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

# project organization

The story project is broken up into two primary categories: structure and narrative. Project organization and standardized processes comprise the structure. Outlines, notes, drafts, and edits comprise the narrative.

## folder structure

\`\`\`
${ storyName }/
├── ${ storyName }.md       # project specifications
├── serial-draft/           # serialized draft
│   └── serial-draft.md     # contains:
│                             - Longform project config
│                             - story synopsis
│                             - character, faction, glossary tables
│                             - story outline
├── reassembly/             # consolidation of serial chapters
│   │                         into thematic representations
│   └── reassembly.md       # contains:
│                             - Longform project config
│                             - general notes on overall narrative
├── 1st-edit/               # Developmental editing pass
│   └── 1st-edit.md         # Longform project config
├── 2nd-edit/               # Copy editing & continuity pass
│   └── 2nd-edit.md         # Longform project config
├── 3rd-edit/               # Line editing & polish
│   └── 3rd-edit.md         # Longform project config
├── final/                  # Publication-ready version
│   └── final.md            # Longform project config
├── world-building docs     # characters, factions, locations, etc
├── glossary/               # worldbuilding vernacular
├── graphics                # book covers, marketing assets, etc
├── [miscellany] 
└── ARCHIVE/
		├── drafts/             # Timestamped snapshots of completed stages
		│   ├── [YYYY-MM-DD]-reassembly/
		│   ├── [YYYY-MM-DD]-1st-edit/
		│   └── [...]
		└── changelog/          # record of changes
\`\`\`

Folders are organized via the [Obsidian Custom File Explorer sorting plugin](https://github.com/SebastianMC/obsidian-custom-sort) and lead with the drafts folders which are organized by revision stage. See [[story-project-spec#revision workflow]]. The story outline lives in the folder note of the first draft, which also contains the preliminary Longform config.

Each stage folder functions as an independent Longform project. Scenes are copied forward to the next stage; the previous stage is archived to \`ARCHIVE/drafts/[YYYY-MM-DD]-[stage-name]/\` as a snapshot once the draft is complete and the scenes have all been copied into the next stage.

# serial publication status

The \`serial-status\` field tracks a scene's publication status in the serial-draft stage, independent of its revision workflow stage. This allows tracking which chapters have been publicly serialized versus which are in development.

**Serial Status Values:**
- \`backlog\`: Planned but not in-progress
- \`active\`: In-progress but not yet completed
- \`ready\`: Completed but not yet scheduled or published
- \`published\`: Released in serial publication
- \`scheduled\`: Queued for future publication
- \`archived\`: Published but removed from active circulation

Example:
\`\`\`yaml
serial-status: published  # This chapter appeared in the serial release
\`\`\`

The \`serial-status\` field is primarily used in the \`serial-draft/\` stage. Scenes copied to \`reassembly\` and should retain this field for historical/archival purposes, but the \`stage-status\` field (below) becomes the primary indicator of revision progress.

# revision workflow

${ storyName } moves through a structured editorial pipeline from penny-dreadful serial draft → comprehensive reassembly → staged editing revisions → final publication version. Each stage is managed as a separate Longform project, enabling isolated focus on specific editorial objectives while preserving complete revision history through comprehensive frontmatter tracking.

**Current stage**: \`serial-draft\` (✓ in-progress) → \`reassembly\` (✓ in-progress) → \`1st-edit\` (next) → \`2nd-edit\` → \`3rd+-edit\` → \`final\` → publishing

## stage-status tracking

The \`stage-status\` field tracks a scene's editorial review state within its current revision stage. Unlike \`serial-status\` (which indicates publication status in the serial-draft), \`stage-status\` reflects the progress of editorial work and review in any stage from reassembly onward.

**Stage-Status Values:**
- \`in-progress\`: Currently being edited or revised
- \`under-review\`: Submitted for editorial review or feedback
- \`needs-revision\`: Review complete; requires additional changes
- \`approved\`: Editorial review complete; ready for next stage

Scenes transition through these states multiple times across different stages. A scene approved in \`reassembly\` resets to \`in-progress\` when copied to \`1st-edit\`, beginning a new editorial cycle.

## frontmatter specification

### universal fields (all scenes in all stages)

\`\`\`yaml
class: scene                           # Always 'scene'
category: [serial | draft]             # Writing or editing
created: YYYY-MM-DD                    # When scene was first created
updated: YYYY-MM-DD                    # When last modified
stage: [serial-draft|reassembly|1st-edit|2nd-edit|3rd-edit|final]  # Current stage
chapter: [number]                      # Reference to source chapter in serial-draft
context: [[I]], [[II]]                 # Prior draft scene mapping (use wiki links)
tags: [${ storyNameNoSpaces }]         # Project identifier and additional metadata for dataview flexibility
\`\`\`

> [!info] A Note About "context"
> The \`context\` field was originally designed to generate backlinks between a serial draft's scene and its related post dashboard for publication. It now serves to manage backlinks between drafts for historical benefit:
> 
> **serial-draft:** \`context\` continues to provide backlinks to publication dashboards. Example:
> \`\`\`
> context: [[${ storyName }-PART-IX]]
> \`\`\`
> 
> **reassembly:** \`context\` maps serial scenes to thematic scenes; thematic scenes are often comprised of numerous serial scenes. Hence the label "reassembly." Example:
> \`\`\`
> context: [[III]], [[IV]], [[V]]
> \`\`\`
> 
> **remaining drafts:** \`context\` maps the prior scene or scenes to the current scene. Because drafts are not set in stone until **final**, this provides historical context of all scenes. Example when using \`context\` in _1st-edit_:
> \`\`\`
> context: [[lunch]], [[the garden]]
> \`\`\`

### revision tracking fields

Two properties exist, depending on the revision stage:

\`\`\`yaml
serial-status: [backlog|active|ready|published|scheduled|archived]
# use if stage === serial-draft

stage-status: [in-progress|under-review|needs-revision|approved]
# use if stage =/= serial-draft
\`\`\`

**serial-status:** tracks the publishing stage of a chapter. See [[story-project-spec#serial publication status]] above.
**stage-status:** editorial review state. See [[story-project-spec#stage-status tracking]] above.

Beyond the _serial-draft_ stage, additional metadata may be included to provided more granular overview of the editorial review state of each scene:

\`\`\`yaml
revision-history:                      # Object tracking all editorial passes
	- stage: reassembly                # Stage name
		editor: self                   # Editor name or 'self'
		date: 2026-02-24               # When edit completed
		focus: |                       # Summary of editorial focus & changes
			Expanded psychological tension in Solomon's
			internal monologue; added 3 new scenes exploring
			spatial distortion; integrated dreamwalk motif.
	
	- stage: 1st-edit
		editor: [editor name]
		date: YYYY-MM-DD
		focus: |
			Developmental pass: verified narrative arc,
			smoothed transitions between reassembly insertions,
			flagged continuity issues for Solomon's timeline.
editorial-notes: "[cross-reference to major inline comments affecting this scene]"
# Example: "See inline comments on dreamwalk mechanics (lines 42-67)"
\`\`\`

## editorial workflow

### stage transitions

1. **Before copying to next stage:**
	 - Verify all inline comments in current stage are resolved or explicitly marked \`[UNRESOLVED]\`
	 - Create snapshot: \`cp -r [current-stage]/ ARCHIVE/[YYYY-MM-DD]-[stage-name]/\`
	 - Commit snapshot: \`git add ARCHIVE/; git commit -m "archive: snapshot of [stage-name] completion"\`

2. **When copying to next stage:**
	 - Copy all scene files from current stage to next stage folder
	 - Update frontmatter: change \`stage:\` field to new stage name
	 - Update frontmatter: reset \`stage-status: in-progress\`
	 - Add new blank entry to \`revision-history:\` array for this stage (editor/date/focus to be filled in)
	 - Preserve all prior \`revision-history\` entries from earlier stages

3. **After commit:**
	 - Git message format: \`"feat: promote [stage-name] to [next-stage-name] ([scene count] scenes)"\`
	 - Include summary of focus areas for next stage

### inline editorial comments

#### serial drafts

For _serial-draft_ stage, mark comments with
\`<!-- [UNRESOLVED] [comment] -->\`
for plot and character development edits and narrative reorganization. Example:

\`\`\`
<!-- [UNRESOLVED] This scene belongs farther along in the narrative, as it signals Solomon's entrance to the maze. -->
\`\`\`

These are to remain in the serial draft, but will be stripped from _reassembly_ when resolved. The \`[UNRESOLVED]\` tracker is focused on _reassembly_; the entries will be removed as the work is completed and these comments are stripped.

#### other stages

For any stage beyond _reassembly_, use
\`<!-- [editor-initials]: [comment] [date] -->\`
format for prose-level feedback. Example:

\`\`\`markdown
Solomon's hand trembles as he traces the ward.

<!-- ME: expand psychological tension here—is this moment
of doubt or determination? The reader needs to feel
the weight of his choice. 2026-02-24 -->

He whispers the incantation, knowing it will be useless.
\`\`\`

For multi-line comment blocks:

\`\`\`markdown
<!-- EDITOR NOTES: Dreamwalk mechanics -->

[Scene content discussing dimensional boundaries...]

<!-- END EDITOR NOTES -->
\`\`\`

Mark resolved comments with \`[RESOLVED]\` before moving to later stages:

\`\`\`markdown
<!-- [RESOLVED] ME: expanded internal conflict (see lines 18-31). 2026-03-01 -->
\`\`\`

### collaborative handoff

When transitioning to a different editor for a stage:

1. Ensure all current-stage comments are clear and actionable
2. Add summary note to first scene of stage: \`editorial-notes: "[High-level feedback from previous editor]"\`
3. In revision-history entry for new stage, note handoff: \`editor: [name], from prior review by [previous editor]\`
4. New editor reviews inline comments, updates revision-history \`focus:\` field upon completion

## longform project configuration template

Each stage folder contains \`[stage-name]/[stage-name].md\` with this structure:

\`\`\`yaml
---
class: story
category: revision
stage:
stage-status:
sorting-spec: |
	< a-z by-metadata: chapter
tags:
	- ${ storyNameNoSpaces }
---

# [Stage Name]

longform:
	format: scenes
	title: ${ storyName }
	draftTitle: [stage name]
	workflow: Default Workflow
	sceneFolder: /
	scenes: [I, II, III, ...]     # List in current ordering (may differ from serial-draft)
	sceneTemplate: templates/story-scene.md
\`\`\`

(Populate \`scenes:\` array with the ordered list of scene filenames for that stage.)

## scene naming evolution

Scene names may evolve across stages to reflect deepened understanding. Track lineage through \`context\` using wikilinks to prior-stage scenes.

Example evolution:
\`\`\`yaml
# reassembly
class: scene
chapter: 4
context: [[IV]]

# 1st-edit (if renamed)
class: scene
chapter: 4
context: [[disoriented]]
# [scene now called something else; context links back]

# 2nd-edit
class: scene
chapter: 4
context: [[1st-edit scene name]]
\`\`\`

## implementation checklist

- [ ] Create folders: \`1st-edit/\`, \`2nd-edit/\`, \`3rd-edit/\`, \`final/\`
- [ ] Create \`[stage-name].md\` Longform config in each folder
- [ ] Copy \`reassembly/\` scenes to \`1st-edit/\` folder
- [ ] Update frontmatter on all scenes: add \`stage:\`, \`stage-status:\`, \`revision-history:\` (with first entry)
- [ ] Create initial snapshot: \`ARCHIVE/[2026-02-24]-reassembly/\` (preserving reassembly as-is before 1st-edit)
- [ ] Verify Longform plugin recognizes all 5 active projects
- [ ] Begin 1st-edit pass with clear editorial objectives (developmental feedback, narrative arc, continuity)
- [ ] Document editorial conventions in project README or this section for new collaborators

---

# scene templates

The following templates are used for creating new scenes at each stage. They are maintained in the vault's \`templates/\` directory and duplicated here for reference when adapting this specification to other story projects.

## serial-draft template

\`\`\`markdown
---
class: scene
category:
  - serial
created:
updated:
stage: serial-draft
serial-status: backlog
chapter:
context:
tags:
---

> [!info] Assigning properties
> **stage:** [serial-draft]
> 
> **serial-status:** [backlog | active | ready | published | scheduled | archived]
> used to track publishing status for serial endeavors, ie Backstage Pass. _serial-status_ is used only during the _serial-draft_ stage.
> 
> **context:** \`[[${ storyName }-PART X]]\`
> used to generate backlinks to the post dashboard of the publication where the chapter will be published. Do not use if story is not being published in serial.

\`\`\`

## reassembly template

\`\`\`markdown
---
class: scene
category:
created:
updated:
stage: reassembly
stage-status: in-progress
serial-chapters:
chapter:
context:
tags:
---

> [!info]+ Assigning properties
> **stage:** [reassembly]
> 
> **stage-status:** [in-progress | under-review | needs-revision | approved]
> _stage-status_ is not set when scene is in _serial-draft_ stage
> 
> **context:** \`[[I], [II]]\`  
> use wikilinks to scenes from _serial-draft_ that are included in the current scene. Used to map and track scenes to thematic chapters

\`\`\`

## draft edits template

\`\`\`markdown
---
class: scene
category:
created:
updated:
stage:
stage-status: in-progress
chapter:
context:
tags:
---

> [!info] Assigning properties
> **stage:** [1st-edit | 2nd-edit | 3rd-edit | final]
> 
> **stage-status:** [in-progress | under-review | needs-revision | approved]
> _stage-status_ is not set when scene is in _serial-draft_ stage
> 
> **context:** \`[[damnation], [the garden]]\`
> map _reassembly_ scenes to current scene. For drafts, this would ideally be 1:1; however, an extensive _1st-edit_ may require expansion or consolidation

\`\`\`

		`
}

/**
 * Generates the serial draft stage configuration document.
 * 
 * Creates a Longform project configuration for the initial serial drafting stage.
 * Includes frontmatter with Longform config, synopsis section, and Dataview queries
 * for tracking characters, groups, and glossary terms.
 * 
 * @function serialDraftTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for serial draft configuration
 */
function serialDraftTemplate(tp, options) {

	const {
		storyName,
		storyNameNoSpaces
	} = options;

	return `---
class: story draft
category: serial
created:
updated:
stage: serial-draft
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# synopsis

# story elements

\`\`\`dataview
TABLE WITHOUT ID
	file.link as Name
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "character")
SORT
	file.name ASC
\`\`\`

\`\`\`dataview
TABLE WITHOUT ID
	file.link as Name
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "group")
SORT
	file.name ASC
\`\`\`

\`\`\`dataview
TABLE WITHOUT ID
	file.link as Term,
	definition as Definition
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "definition")
SORT
	file.name ASC
\`\`\`

# history

# outline

`
}

/**
 * Generates the reassembly stage configuration document.
 * 
 * Creates a Longform project configuration for reassembly stage where serial
 * chapters are consolidated into thematic scenes. Includes scene tracking
 * dashboards and unresolved comment tracking with Dataview/DataviewJS queries.
 * 
 * @function reassemblyDraftTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for reassembly stage configuration
 */
function reassemblyDraftTemplate(tp, options) {

	const {
			storyName,
			storyNameNoSpaces
	} = options;

	return `---
class: story draft
category: draft
created:
updated:
stage: reassembly
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# scene tracking

## serial draft reassembly

**Reassembly Scene Mapping to Serial-Draft Chapters:**
\`\`\`dataview
TABLE WITHOUT ID
	file.link as "Reassembly Scene",
	context as "Serial Chapters",
stage-status as Status
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "reassembly")
SORT
	file.name ASC
\`\`\`

**Serial Chapters Mapped to Reassembly Scenes:**
\`\`\`dataview
TABLE WITHOUT ID
	serial as "Serial Ch",
	rows.file.link as "Reassembly Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "reassembly") AND
	context
FLATTEN
	context as serial
GROUP BY
	serial
SORT
	serial ASC
\`\`\`

# issue tracking

**Scenes with Unresolved Comments:**
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("reassembly"));

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("[UNRESOLVED]")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

`
}

/**
 * Generates the first edit stage configuration document.
 * 
 * Creates a Longform project configuration for the developmental editing pass.
 * Focuses on narrative arc, structure, and overall story coherence. Includes
 * scene lineage tracking from reassembly and editorial comment tracking.
 * 
 * @function firstEditTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for first edit stage configuration
 */
function firstEditTemplate(tp, options) {

		const {
				storyName,
				storyNameNoSpaces
		} = options;

		return `---
class: story draft
category: draft
created:
updated:
stage: 1st-edit
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# scene tracking

## Reassembly → 1st-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "Reassembly Scene",
	rows.file.link as "1st-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "1st-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

# in-line comments tracking

**Scenes with Editorial Comments (ME tag):** 
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("1st-edit")
	);

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("<!-- ME:")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

`
}

/**
 * Generates the second edit stage configuration document.
 * 
 * Creates a Longform project configuration for the copy editing and continuity
 * verification pass. Ensures consistency in plot, character development, and
 * world-building details. Includes scene lineage tracking and comment tracking.
 * 
 * @function secondEditTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for second edit stage configuration
 */
function secondEditTemplate(tp, options) {

		const {
				storyName,
				storyNameNoSpaces
		} = options;

		return `---
class: story draft
category: draft
created:
updated:
stage: 2nd-edit
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# scene tracking

## 1st-edit → 2nd-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "1st-edit Scene",
	rows.file.link as "2nd-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "2nd-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

# in-line comments tracking

**Scenes with Editorial Comments (ME tag):** 
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("2nd-edit")
	);

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("<!-- ME:")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

`
}

/**
 * Generates the third edit stage configuration document.
 * 
 * Creates a Longform project configuration for the line editing and prose
 * polish pass. Focuses on sentence-level improvements, word choice, rhythm,
 * and stylistic refinement. Includes scene lineage tracking and comment tracking.
 * 
 * @function thirdEditTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for third edit stage configuration
 */
function thirdEditTemplate(tp, options) {

		const {
				storyName,
				storyNameNoSpaces
		} = options;

		return `---
class: story draft
category: draft
created:
updated:
stage: 3rd-edit
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# scene tracking

## 2nd-edit → 3rd-edit
\`\`\`dataview
TABLE WITHOUT ID
	source as "2nd-edit Scene",
	rows.file.link as "3rd-edit Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "3rd-edit") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

# in-line comments tracking

**Scenes with Editorial Comments (ME tag):** 
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("3rd-edit")
	);

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("<!-- ME:")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

`
}

/**
 * Generates the final edit stage configuration document.
 * 
 * Creates a Longform project configuration for the publication-ready version.
 * This stage contains the polished, completed manuscript ready for export to
 * publication formats (PDF, EPUB, etc.). Includes scene lineage tracking and
 * final comment verification.
 * 
 * @function finalEditTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for final stage configuration
 */
function finalEditTemplate(tp, options) {

		const {
				storyName,
				storyNameNoSpaces
		} = options;

		return `---
class: story draft
category: draft
created:
updated:
stage: final
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Revision Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# scene tracking

## 3rd-edit → final
\`\`\`dataview
TABLE WITHOUT ID
	source as "3rd-edit Scene",
	rows.file.link as "final Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "final") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

# in-line comments tracking

**Scenes with Editorial Comments (ME tag):** 
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("final")
	);

const results = [];
for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	if (content && content.includes("<!-- ME:")) {
		results.push(page.file.link);
	}
}

dv.list(results);
\`\`\`

`
}