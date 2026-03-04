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
 * 4. ARCHIVE STRUCTURE CREATION
 *    - Creates ARCHIVE directory for project history management
 *    - Generates archive dashboard with velocity tracking and integrity checks
 *    - Creates CHANGELOG directory with standardized session recording template
 *    - Establishes DRAFTS directory for revision stage snapshots
 * 
 * FUNCTIONS:
 * - newStoryProject: Main entry point for project generation
 * - storyProjectSpec: Generates master project specification document
 * - serialDraftTemplate: Creates serial draft stage configuration
 * - reassemblyDraftTemplate: Creates reassembly stage configuration
 * - revisionStageTemplate: Creates revision stage (1st/2nd/3rd-edit, final) configuration
 * - generateArchiveDashboard: Creates archive operations dashboard
 * - generateChangelogTemplate: Creates standardized changelog entry template
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

	/*****************************************
	 * GENERATE EDITORIAL REVISION STRUCTURE *
	 *****************************************/

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
	const firstEditContent = revisionStageTemplate(tp, {
		storyName,
		storyNameNoSpaces,
		priorStage: reassembly.basename
	});
	const firstEditNote = await tp.file.create_new(
		firstEditContent,
		'1st-edit',
		false,
		firstEdit
	);
	console.log(`Created 1st-edit note at ${ firstEditNote }`);

	// set up 2nd-edit
	const secondEdit = await tp.app.vault.createFolder(`${ path }/2nd-edit`);
	const secondEditContent = revisionStageTemplate(tp, {
		storyName,
		storyNameNoSpaces,
		priorStage: firstEdit.basename
	});
	const secondEditNote = await tp.file.create_new(
		secondEditContent,
		'2nd-edit',
		false,
		secondEdit
	);
	console.log(`Created 2nd-edit note at ${ secondEditNote }`);

	// set up 3rd-edit
	const thirdEdit = await tp.app.vault.createFolder(`${ path }/3rd-edit`);
	const thirdEditContent = revisionStageTemplate(tp, {
		storyName,
		storyNameNoSpaces,
		priorStage: secondEdit.basename
	});
	const thirdEditNote = await tp.file.create_new(
		thirdEditContent,
		'3rd-edit',
		false,
		thirdEdit
	);
	console.log(`Created 3rd-edit note at ${ thirdEditNote }`);

	// set up final
	const final = await tp.app.vault.createFolder(`${ path }/final`);
	const finalEditContent = revisionStageTemplate(tp, {
		storyName,
		storyNameNoSpaces,
		priorStage: thirdEdit.basename
	});
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

	/******************************
	 * GENERATE ARCHIVE STRUCTURE *
	 ******************************/

	// create the archive directory and dashboard
	const archiveDirectory = await tp.app.vault.createFolder(`${ path }/ARCHIVE`);
	const archiveREADMEContent = generateArchiveDashboard(storyNameNoSpaces);
	await tp.file.create_new(
		archiveREADMEContent,
		'ARCHIVE',
		false,
		archiveDirectory
	);

	// create changelog directory and template
	const changelogDirectory = await tp.app.vault.createFolder(`${ path }/ARCHIVE/CHANGELOG`);
	const changelogTemplate = generateChangelogTemplate({ storyNameNoSpaces });
	await tp.file.create_new(
		changelogTemplate,
		'CHANGELOG',
		false,
		changelogDirectory
	);


	const draftsArchiveDirectory = await tp.app.vault.createFolder(`${ path }/ARCHIVE/DRAFTS`);
	await tp.file.create_new(
		'',
		'DRAFTS',
		false,
		draftsArchiveDirectory
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
class: serial
category: draft
created:
updated:
stage: serial-draft
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Default Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# overview

# contents

\`\`\`toc
\`\`\`

# serial dashboard
Tracking serial publication workflow, metadata integrity, and readiness for reassembly stage advancement.

## scene metadata management
Validates that all serial-draft scenes have required metadata fields: stage, serial-status, and chapter.

### incomplete metadata
\`\`\`dataviewjs
const serialScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "serial-draft");

const serialSceneIncomplete = [];

for (const scene of serialScenes) {
  const hasStage = scene.stage !== undefined && scene.stage !== null;
  const hasSerialStatus = scene["serial-status"] !== undefined && scene["serial-status"] !== null;
  const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
  
  if (!(hasStage && hasSerialStatus && hasChapter)) {
    const missing = [];
    if (!hasStage) missing.push("stage");
    if (!hasSerialStatus) missing.push("serial-status");
    if (!hasChapter) missing.push("chapter");
    
    serialSceneIncomplete.push({
      link: scene.file.link,
      missing: missing.join(", ")
    });
  }
}

if (serialSceneIncomplete.length === 0) {
  dv.paragraph("All serial scenes have complete metadata.");
} else {
  dv.table(
    ["Scene", "Missing Fields"],
    serialSceneIncomplete.map(s => [s.link, s.missing])
  );
}
\`\`\`

### serial scene metadata completeness
\`\`\`dataviewjs
const serialScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "serial-draft");

let complete = 0;
let incomplete = 0;

for (const scene of serialScenes) {
  const hasStage = scene.stage !== undefined && scene.stage !== null;
  const hasSerialStatus = scene["serial-status"] !== undefined && scene["serial-status"] !== null;
  const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
  
  if (hasStage && hasSerialStatus && hasChapter) {
    complete++;
  } else {
    incomplete++;
  }
}

if (complete === 0 && incomplete === 0) {
  dv.paragraph("No serial scenes found.");
} else {
  let mermaidCode = "pie title serial scene metadata completeness\\n";
  mermaidCode += \`    "complete" : \${complete}\\n\`;
  mermaidCode += \`    "incomplete" : \${incomplete}\\n\`;
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}

dv.paragraph(\`**Complete**: \${complete} | **Incomplete**: \${incomplete} | **Total**: \${complete + incomplete}\`);
\`\`\`

## status distribution
Breakdown of serial-status values across all serial-draft scenes (published, active, backlog, etc.).

\`\`\`dataviewjs
const serialScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "serial-draft");

const statusCounts = {};
for (const scene of serialScenes) {
  const status = scene["serial-status"] || "unset";
  statusCounts[status] = (statusCounts[status] || 0) + 1;
}

const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

if (total === 0) {
  dv.paragraph("No serial-draft scenes found.");
} else {
  let mermaidCode = "pie title serial-draft status distribution\n";
  for (const [status, count] of Object.entries(statusCounts)) {
    mermaidCode += \`    "\${status}" : \${count}\\n\`;
  }
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}
\`\`\`

## promotion readiness gate
Tracks which serial-draft scenes have been accounted for in reassembly context fields. When 100%, all serial content has been incorporated into the reassembly stage.

\`\`\`dataviewjs
const serialScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "serial-draft");

const serialLinks = new Set();
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

for (const rScene of reassemblyScenes) {
  if (rScene.context && Array.isArray(rScene.context)) {
    for (const ctx of rScene.context) {
      const ctxPath = ctx.path || String(ctx);
      if (ctxPath.includes("serial-draft")) {
        const filename = ctxPath.split('/').pop();
        serialLinks.add(filename);
      }
    }
  }
}

const total = serialScenes.length;
const accounted = serialLinks.size;
const percentage = total > 0 ? Math.round((accounted / total) * 100) : 0;

if (total === 0) {
  dv.paragraph("No serial-draft scenes found.");
} else {
  let mermaidCode = "pie title serial-draft promotion readiness\\n";
  mermaidCode += \`    "Accounted: \${accounted}" : \${accounted}\\n\`;
  mermaidCode += \`    "Pending: \${total - accounted}" : \${total - accounted}\\n\`;
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
  dv.paragraph(\`\${percentage}% of serial-draft scenes are accounted for in reassembly.\`);
}
\`\`\`


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
class: revision
category: draft
created:
updated:
stage: reassembly
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Default Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# contents

\`\`\`toc
\`\`\`

# reassembly editorial dashboard
Tracking revision stage workflow, scene metadata integrity, and readiness for revision stage advancement.

## unresolved comments
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
  .where(p => \`\${p.class}\`.includes("scene"))
  .where(p => \`\${p.stage}\`.includes("reassembly"));

const results = [];
for (const page of pages) {
  const file = app.vault.getAbstractFileByPath(page.file.path);
  if (!file) continue;
  const content = await app.vault.read(file);
  if (content && content.includes("UNRESOLVED")) {
    results.push(page.file.link);
  }
}

dv.list(results);
\`\`\`

## scene metadata management
Validates that all draft scenes have required metadata fields: stage, stage-status, chapter, and context.

### incomplete metadata
\`\`\`dataviewjs
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

const reassemblySceneIncomplete = [];

for (const scene of reassemblyScenes) {
  const hasStage = scene.stage !== undefined && scene.stage !== null;
  const hasStageStatus = scene["stage-status"] !== undefined && scene["stage-status"] !== null;
  const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
  const hasContext = scene.context !== undefined && scene.context !== null;

  if (!(hasStage && hasStageStatus && hasChapter && hasContext)) {
    const missing = [];
    if (!hasStage) missing.push("stage");
    if (!hasStageStatus) missing.push("stage-status");
    if (!hasChapter) missing.push("chapter");
    if (!hasContext) missing.push("context");

    reassemblySceneIncomplete.push({
      link: scene.file.link,
      missing: missing.join(", ")
    });
  }
}

if (reassemblySceneIncomplete.length === 0) {
  dv.paragraph("All reassembly scenes have complete metadata.");
} else {
  dv.table(
    ["Scene", "Missing Fields"],
    reassemblySceneIncomplete.map(s => [s.link, s.missing])
  );
}
\`\`\`

### reassembly scene metadata completeness
\`\`\`dataviewjs
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

let complete = 0;
let incomplete = 0;

for (const scene of reassemblyScenes) {
  const hasStage = scene.stage !== undefined && scene.stage !== null;
  const hasStageStatus = scene["stage-status"] !== undefined && scene["stage-status"] !== null;
  const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
  const hasContext = scene.context !== undefined && scene.context !== null;

  if (hasStage && hasStageStatus && hasChapter && hasContext) {
    complete++;
  } else {
    incomplete++;
  }
}

if (complete === 0 && incomplete === 0) {
  dv.paragraph("No reassembly scenes found.");
} else {
  let mermaidCode = "pie title reassembly scene metadata completeness\\n";
  mermaidCode += \`    "complete" : \${complete}\\n\`;
  mermaidCode += \`    "incomplete" : \${incomplete}\\n\`;
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}

dv.paragraph(\`**Complete**: \${complete} | **Incomplete**: \${incomplete} | **Total**: \${complete + incomplete}\`);
\`\`\`

## status distribution
Breakdown of status values across all draft scenes (approved, in-progress, needs-revision, etc.).

\`\`\`dataviewjs
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

const statusCounts = {};
for (const scene of reassemblyScenes) {
  const status = scene["stage-status"] || "unset";
  statusCounts[status] = (statusCounts[status] || 0) + 1;
}

const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

if (total === 0) {
  dv.paragraph("No reassembly scenes found.");
} else {
  let mermaidCode = "pie title reassembly status distribution\\n";
  for (const [status, count] of Object.entries(statusCounts)) {
    mermaidCode += \`    "\${status}" : \${count}\\n\`;
  }
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}
\`\`\`

## scene lineage
Tracking scenes across revision stages. The Story Spec contains the full set of tables to track scenes from their inception through the workflow. Each draft tracks its specific scene mapping from the prior revision stage.

### lineage completeness
\`\`\`dataviewjs
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

const scenesByLineage = { documented: [], undocumented: [] };

for (const scene of reassemblyScenes) {
  if (scene.context && (Array.isArray(scene.context) ? scene.context.length > 0 : true)) {
    scenesByLineage.documented.push(scene.file.link);
  } else {
    scenesByLineage.undocumented.push(scene.file.link);
  }
}

if (scenesByLineage.undocumented.length === 0) {
  dv.paragraph("✓ All reassembly scenes have documented lineage.");
} else {
  dv.paragraph(\`**Lineage Documented**: \${scenesByLineage.documented.length} scenes\`);
  if (scenesByLineage.documented.length > 0) {
    dv.list(scenesByLineage.documented);
  }
  dv.paragraph(\`**Lineage Pending**: \${scenesByLineage.undocumented.length} scenes\`);
  dv.list(scenesByLineage.undocumented);
}
\`\`\`

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

## promotion readiness gate
Tracks which serial-draft scenes have been accounted for in reassembly context fields. When 100%, all serial content has been incorporated into the reassembly stage.

\`\`\`dataviewjs
const serialScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "serial-draft");

const serialLinks = new Set();
const reassemblyScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene")
  .where(p => p.stage === "reassembly");

for (const rScene of reassemblyScenes) {
  if (rScene.context && Array.isArray(rScene.context)) {
    for (const ctx of rScene.context) {
      const ctxPath = ctx.path || String(ctx);
      if (ctxPath.includes("serial-draft")) {
        const filename = ctxPath.split('/').pop();
        serialLinks.add(filename);
      }
    }
  }
}

const total = serialScenes.length;
const accounted = serialLinks.size;
const percentage = total > 0 ? Math.round((accounted / total) * 100) : 0;

if (total === 0) {
  dv.paragraph("No serial-draft scenes found.");
} else {
  let mermaidCode = "pie title reassembly promotion readiness\\n";
  mermaidCode += \`    "Accounted: \${accounted}" : \${accounted}\\n\`;
  mermaidCode += \`    "Pending: \${total - accounted}" : \${total - accounted}\\n\`;
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
  dv.paragraph(\`\${percentage}% of serial-draft scenes are accounted for in reassembly.\`);
}
\`\`\`

`
}

/**
 * Generates a revision stage configuration document.
 * 
 * Creates a Longform project configuration for one of four editing passes.
 * Includes scene lineage tracking from reassembly and editorial comment 
 * tracking.
 * 
 * @function revisionStageTemplate
 * @param {Object} tp - Templater plugin API object
 * @param {Object} options - Template options
 * @param {string} options.storyName - Story project name
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content for revision stage configuration
 */
function revisionStageTemplate(tp, options) {

	const {
			storyName,
			storyNameNoSpaces,
			priorStage
	} = options;

	return `---
class: revision
category: draft
created:
updated:
stage: ${ tp.file.folder() }
stage-status:
longform:
  format: scenes
  title: ${ storyName }
  draftTitle: ${ tp.file.folder() }
  workflow: Default Workflow
  sceneFolder: /
  scenes:
context:
tags:
  - ${ storyNameNoSpaces }
---

# contents

\`\`\`toc
\`\`\`

# first edit editorial dashboard
Tracking revision stage workflow, scene metadata integrity, and readiness for revision stage advancement.

## carryover debt

\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("${ tp.file.folder() }"));

const results = [];
const markers = ["<!-- TODO:", "<!-- ME:", "<!-- UNRESOLVED"];

for (const page of pages) {
	const file = app.vault.getAbstractFileByPath(page.file.path);
	if (!file) continue;
	const content = await app.vault.read(file);
	for (const marker of markers) {
		if (content && content.includes(marker)) {
			results.push(page.file.link);
			break;
		}
	}
}

if (results.length === 0) {
	dv.paragraph("✓ No carryover debt.");
} else {
	dv.list(results);
}
\`\`\`

## editorial comments

### '\`<!-- ME:\`' comments
\`\`\`dataviewjs
const pages = dv.pages("#${ storyNameNoSpaces }")
	.where(p => \`\${p.class}\`.includes("scene"))
	.where(p => \`\${p.stage}\`.includes("${ tp.file.folder() }")
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

## scene metadata management
Validates that all draft scenes have required metadata fields: stage, stage-status, chapter, and context.

### incomplete metadata
\`\`\`dataviewjs
const stageScenes = dv.pages('#${ storyNameNoSpaces }')
	.where(p => p.class === "scene")
	.where(p => p.stage === "${ tp.file.folder() }");

const stageIncomplete = [];

for (const scene of stageScenes) {
	const hasStage = scene.stage !== undefined && scene.stage !== null;
	const hasStageStatus = scene["stage-status"] !== undefined && scene["stage-status"] !== null;
	const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
	const hasContext = scene.context !== undefined && scene.context !== null;

	if (!(hasStage && hasStageStatus && hasChapter && hasContext)) {
		const missing = [];
		if (!hasStage) missing.push("stage");
		if (!hasStageStatus) missing.push("stage-status");
		if (!hasChapter) missing.push("chapter");
		if (!hasContext) missing.push("context");

		stageIncomplete.push({
			link: scene.file.link,
			missing: missing.join(", ")
		});
	}
}

if (stageIncomplete.length === 0) {
	dv.paragraph("All ${ tp.file.folder() } scenes have complete metadata.");
} else {
	dv.table(
		["Scene", "Missing Fields"],
		stageIncomplete.map(s => [s.link, s.missing])
	);
}
\`\`\`

### ${ tp.file.folder() } scene metadata completeness
\`\`\`dataviewjs
const stageScenes = dv.pages('#${ storyNameNoSpaces }')
	.where(p => p.class === "scene")
	.where(p => p.stage === "${ tp.file.folder() }");

let complete = 0;
let incomplete = 0;

for (const scene of stageScenes) {
	const hasStage = scene.stage !== undefined && scene.stage !== null;
	const hasStageStatus = scene["stage-status"] !== undefined && scene["stage-status"] !== null;
	const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
	const hasContext = scene.context !== undefined && scene.context !== null;

	if (hasStage && hasStageStatus && hasChapter && hasContext) {
		complete++;
	} else {
		incomplete++;
	}
}

if (complete === 0 && incomplete === 0) {
	dv.paragraph("No ${ tp.file.folder() } scenes found.");
} else {
	let mermaidCode = "pie title first edit scene metadata completeness\\n";
	mermaidCode += \`    "complete" : \${complete}\\n\`;
	mermaidCode += \`    "incomplete" : \${incomplete}\\n\`;
	dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}

dv.paragraph(\`**Complete**: \${complete} | **Incomplete**: \${incomplete} | **Total**: \{complete + incomplete}\`);
\`\`\`

## status distribution
Breakdown of status values across all draft scenes (approved, in-progress, needs-revision, etc.).

\`\`\`dataviewjs
const stageScenes = dv.pages('#${ storyNameNoSpaces }')
	.where(p => p.class === "scene")
	.where(p => p.stage === "${ tp.file.folder() }");

const statusCounts = {};
for (const scene of stageScenes) {
	const status = scene["stage-status"] || "unset";
	statusCounts[status] = (statusCounts[status] || 0) + 1;
}

const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

if (total === 0) {
	dv.paragraph("No ${ tp.file.folder() } scenes found.");
} else {
	let mermaidCode = "pie title first edit status distribution\\n";
	for (const [status, count] of Object.entries(statusCounts)) {
		mermaidCode += \`    "\${status}" : \${count}\\n\`;
	}
	dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}
\`\`\`

## scene lineage
Tracking scenes across revision stages. The Story Spec contains the full set of tables to track scenes from their inception through the workflow. Each draft tracks its specific scene mapping from the prior revision stage.

### lineage completeness

\`\`\`dataviewjs
const stageScenes = dv.pages('#${ storyNameNoSpaces }')
	.where(p => p.class === "scene")
	.where(p => p.stage === "${ tp.file.folder() }");

const scenesByLineage = { documented: [], undocumented: [] };

for (const scene of stageScenes) {
	if (scene.context && (Array.isArray(scene.context) ? scene.context.length > 0 : true)) {
		scenesByLineage.documented.push(scene.file.link);
	} else {
		scenesByLineage.undocumented.push(scene.file.link);
	}
}

if (scenesByLineage.undocumented.length === 0) {
	dv.paragraph("✓ All ${ tp.file.folder() } scenes have documented lineage.");
} else {
	dv.paragraph(\`**Lineage Documented**: \${scenesByLineage.documented.length} scenes | **Lineage Pending**: \${scenesByLineage.undocumented.length} scenes\`);
}
\`\`\`


### cross-stage lineage: ${ priorStage } → ${ tp.file.folder() }
\`\`\`dataview
TABLE WITHOUT ID
	source as "${ priorStage } Scene",
	rows.file.link as "${ tp.file.folder() } Scenes"
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(class, "scene") AND
	contains(stage, "${ tp.file.folder() }") AND
	context
FLATTEN
	context as source
GROUP BY
	source
SORT
	source ASC
\`\`\`

`
}

/**
 * Generates the archive operations dashboard and documentation.
 * 
 * Creates a comprehensive dashboard for tracking project history, session velocity,
 * work patterns, and metadata integrity across all file classes. Includes operational
 * governance guidelines for changelog capture and draft archival processes.
 * 
 * @function generateArchiveDashboard
 * @param {string} storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown content with Dataview/DataviewJS queries for archive management
 */
function generateArchiveDashboard(storyNameNoSpaces) {

	return `---
class: archive
category:
  - operations
  - dashboard
  - specification
updated:
created:
tags:
  - ${ storyNameNoSpaces }
---

# ARCHIVE Operations Guide

# contents
\`\`\`toc
\`\`\`

---

# archive dashboard

*These queries track project velocity, session patterns, and archival integrity across the lifespan of the work.*

## changelog velocity

### recent activity (last 30 days)
\`\`\`dataview
TABLE WITHOUT ID
	file.link as Entry,
	session-type as Type,
	scenes-edited as "Scenes Edited",
	files-modified as Modified,
	files-created as Created,
	files-archived as "Archived/Removed",
	stage-transition as "Stage Transition"
FROM
	#${ storyNameNoSpaces } AND
WHERE
	contains(category, "changelog") AND
	created >= date(today) - dur(30 days)
SORT
	created DESC
\`\`\`

### session frequency (last 90 days)
\`\`\`dataviewjs
const changelogs = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.category && p.category.includes("changelog"))
  .where(p => p.created >= dv.date("today") - dv.duration("90 days"));

const total = changelogs.length;
const weeks = 13; // ~90 days / 7
const avgPerWeek = (total / weeks).toFixed(1);

dv.paragraph(\`**Total entries**: \${total} | **Average**: \${avgPerWeek} sessions/week\`);

// Weekly activity chart
const weeklyData = {};
for (const log of changelogs) {
  if (log.created) {
    const weekStart = log.created.startOf('week');
    const weekKey = weekStart.toFormat('yyyy-MM-dd');
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
  }
}

const sortedWeeks = Object.keys(weeklyData).sort();
if (sortedWeeks.length > 0) {
  const categories = sortedWeeks.map(w => \`"\${w}"\`);
  const values = sortedWeeks.map(w => weeklyData[w]);
  
  dv.paragraph(\`\\\`\\\`\\\`mermaid\\n%%{init: {'theme':'base'}}%%\\nxychart-beta\\n    title "weekly session count (last 90 days)"\\n    x-axis [\${categories.join(", ")}]\\n    y-axis sessions 0 --> \${Math.max(...values) + 2}\\n    bar [\${values.join(", ")}]\\n\\\`\\\`\\\`\`);
}
\`\`\`

### work distribution (last 30 days)

\`\`\`dataviewjs
const changelogs = dv.pages("#${ storyNameNoSpaces }")
  .where(p => p.category && p.category.includes("changelog"))
  .where(p => p.created >= dv.date("today") - dv.duration("30 days"));

const byType = {};
for (const log of changelogs) {
  const type = log["session-type"] || "unspecified";
  byType[type] = (byType[type] || 0) + 1;
}

if (Object.keys(byType).length === 0) {
  dv.paragraph("No sessions in the last 30 days.");
} else {
  let mermaidCode = "pie title work distribution (last 30 days)\\n";
  for (const [type, count] of Object.entries(byType)) {
    mermaidCode += \`    "\${type}" : \${count}\\n\`;
  }
  dv.paragraph("\`\`\`mermaid\\n" + mermaidCode + "\`\`\`");
}
\`\`\`

### session intensity (last 30 days)
\`\`\`dataviewjs
const changelogs = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.category && p.category.includes("changelog"))
  .where(p => p.created >= dv.date("today") - dv.duration("30 days"));

const sessions = changelogs.values.map(log => ({
  link: log.file.link,
  date: log.created,
  total: (log["files-modified"] || 0) + (log["files-created"] || 0) + (log["files-archived"] || 0)
}));

sessions.sort((a, b) => b.total - a.total);

const topSessions = sessions.slice(0, 10);

if (topSessions.length === 0) {
  dv.paragraph("No sessions in the last 30 days.");
} else {
  dv.table(
    ["Session", "Date", "Files Touched"],
    topSessions.map(s => [s.link, s.date?.toFormat("yyyy-MM-dd") || "—", s.total])
  );
}
\`\`\`

---

## archive integrity

This section tracks metadata completeness across all file classes in the project. Each class has different required fields based on its role in the workflow.

### story class
\`\`\`dataviewjs
const storyFiles = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "story");

let storyComplete = 0;
const storyIncomplete = [];

for (const file of storyFiles) {
  const hasStage = file.stage !== undefined && file.stage !== null;
  const hasStageStatus = file["stage-status"] !== undefined && file["stage-status"] !== null;
  const hasSerialDraft = file["serial-draft"] !== undefined && file["serial-draft"] !== null;
  const hasReassembly = file.reassembly !== undefined && file.reassembly !== null;
  
  if (hasStage && hasStageStatus && hasSerialDraft && hasReassembly) {
    storyComplete++;
  } else {
    const missing = [];
    if (!hasStage) missing.push("stage");
    if (!hasStageStatus) missing.push("stage-status");
    if (!hasSerialDraft) missing.push("serial-draft");
    if (!hasReassembly) missing.push("reassembly");
    
    storyIncomplete.push({
      link: file.file.link,
      missing: missing.join(", ")
    });
  }
}

dv.paragraph(\`**Story Files**: \${storyComplete} complete, \${storyIncomplete.length} incomplete\`);

if (storyIncomplete.length > 0) {
  dv.table(
    ["File", "Missing Fields"],
    storyIncomplete.map(f => [f.link, f.missing])
  );
}
\`\`\`

### serial class
\`\`\`dataviewjs
const serialFiles = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "serial");

const serialRows = [];
let serialComplete = 0;

for (const file of serialFiles) {
  const longform = file.longform || {};
  
  const hasStageStatus = file["stage-status"] !== undefined && file["stage-status"] !== null;
  const hasFormat = longform.format !== undefined && longform.format !== null;
  const hasTitle = longform.title !== undefined && longform.title !== null;
  const hasDraftTitle = longform.draftTitle !== undefined && longform.draftTitle !== null;
  const hasWorkflow = longform.workflow !== undefined && longform.workflow !== null;
  
  if (hasStageStatus && hasFormat && hasTitle && hasDraftTitle && hasWorkflow) {
    serialComplete++;
  }
  
  serialRows.push([
    file.file.link,
    hasStageStatus ? "✓" : "—",
    hasFormat ? "✓" : "—",
    hasTitle ? "✓" : "—",
    hasDraftTitle ? "✓" : "—",
    hasWorkflow ? "✓" : "—"
  ]);
}

dv.paragraph(\`**Serial Files**: \${serialComplete}/\${serialFiles.length} complete\`);

if (serialFiles.length > 0) {
  dv.table(
    ["File", "stage-status", "format", "title", "draftTitle", "workflow"],
    serialRows
  );
}
\`\`\`

### revision class
\`\`\`dataviewjs
const revisionFiles = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "revision");

const revisionRows = [];
let revisionComplete = 0;

for (const file of revisionFiles) {
  const longform = file.longform || {};
  
  const hasStage = file.stage !== undefined && file.stage !== null;
  const hasStageStatus = file["stage-status"] !== undefined && file["stage-status"] !== null;
  const hasFormat = longform.format !== undefined && longform.format !== null;
  const hasTitle = longform.title !== undefined && longform.title !== null;
  const hasDraftTitle = longform.draftTitle !== undefined && longform.draftTitle !== null;
  const hasWorkflow = longform.workflow !== undefined && longform.workflow !== null;
  
  if (hasStage && hasStageStatus && hasFormat && hasTitle && hasDraftTitle && hasWorkflow) {
    revisionComplete++;
  }
  
  revisionRows.push([
    file.file.link,
    hasStage ? "✓" : "—",
    hasStageStatus ? "✓" : "—",
    hasFormat ? "✓" : "—",
    hasTitle ? "✓" : "—",
    hasDraftTitle ? "✓" : "—",
    hasWorkflow ? "✓" : "—"
  ]);
}

dv.paragraph(\`**Revision Files**: \${revisionComplete}/\${revisionFiles.length} complete\`);

if (revisionFiles.length > 0) {
  dv.table(
    ["File", "stage", "stage-status", "format", "title", "draftTitle", "workflow"],
    revisionRows
  );
}
\`\`\`

### scene class
\`\`\`dataviewjs
const allScenes = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "scene");

let serialSceneComplete = 0;
let serialSceneIncomplete = [];
let reassemblySceneComplete = 0;
let reassemblySceneIncomplete = [];

for (const scene of allScenes) {
  if (scene.stage === "serial-draft") {
    // Serial-draft scenes need: stage, serial-status, chapter
    const hasStage = scene.stage !== undefined && scene.stage !== null;
    const hasSerialStatus = scene["serial-status"] !== undefined && scene["serial-status"] !== null;
    const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
    
    if (hasStage && hasSerialStatus && hasChapter) {
      serialSceneComplete++;
    } else {
      const missing = [];
      if (!hasStage) missing.push("stage");
      if (!hasSerialStatus) missing.push("serial-status");
      if (!hasChapter) missing.push("chapter");
      
      serialSceneIncomplete.push({
        link: scene.file.link,
        missing: missing.join(", ")
      });
    }
  } else if (["reassembly", "1st-edit", "2nd-edit", "3rd-edit", "final"].includes(scene.stage)) {
    // Reassembly+ scenes need: stage, stage-status, chapter, context
    const hasStage = scene.stage !== undefined && scene.stage !== null;
    const hasStageStatus = scene["stage-status"] !== undefined && scene["stage-status"] !== null;
    const hasChapter = scene.chapter !== undefined && scene.chapter !== null;
    const hasContext = scene.context !== undefined && scene.context !== null;
    
    if (hasStage && hasStageStatus && hasChapter && hasContext) {
      reassemblySceneComplete++;
    } else {
      const missing = [];
      if (!hasStage) missing.push("stage");
      if (!hasStageStatus) missing.push("stage-status");
      if (!hasChapter) missing.push("chapter");
      if (!hasContext) missing.push("context");
      
      reassemblySceneIncomplete.push({
        link: scene.file.link,
        missing: missing.join(", ")
      });
    }
  }
}

dv.paragraph(\`**Serial-Draft Scenes**: \${serialSceneComplete} complete, \${serialSceneIncomplete.length} incomplete\`);

if (serialSceneIncomplete.length > 0) {
  dv.table(
    ["Scene", "Missing Fields"],
    serialSceneIncomplete.map(s => [s.link, s.missing])
  );
}

dv.paragraph(\`**Reassembly+ Scenes**: \${reassemblySceneComplete} complete, \${reassemblySceneIncomplete.length} incomplete\`);

if (reassemblySceneIncomplete.length > 0) {
  dv.table(
    ["Scene", "Missing Fields"],
    reassemblySceneIncomplete.map(s => [s.link, s.missing])
  );
}
\`\`\`

### archive/changelog class
\`\`\`dataviewjs
const changelogs = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.category && p.category.includes("changelog"))
  .where(p => !p.file.path.includes("CHANGELOG.md"));

let changelogComplete = 0;
const changelogIncomplete = [];

for (const file of changelogs) {
  const hasSessionType = file["session-type"] !== undefined && file["session-type"] !== null;
  const hasCommitSha = file["commit-sha"] !== undefined && file["commit-sha"] !== null;
  const hasFilesModified = file["files-modified"] !== undefined && file["files-modified"] !== null;
  const hasFilesCreated = file["files-created"] !== undefined && file["files-created"] !== null;
  const hasFilesArchived = file["files-archived"] !== undefined && file["files-archived"] !== null;
  
  if (hasSessionType && hasCommitSha && hasFilesModified && hasFilesCreated && hasFilesArchived) {
    changelogComplete++;
  } else {
    const missing = [];
    if (!hasSessionType) missing.push("session-type");
    if (!hasCommitSha) missing.push("commit-sha");
    if (!hasFilesModified) missing.push("files-modified");
    if (!hasFilesCreated) missing.push("files-created");
    if (!hasFilesArchived) missing.push("files-archived");
    
    changelogIncomplete.push({
      link: file.file.link,
      missing: missing.join(", ")
    });
  }
}

dv.paragraph(\`**Changelog Entries**: \${changelogComplete} complete, \${changelogIncomplete.length} incomplete\`);

if (changelogIncomplete.length > 0) {
  dv.table(
    ["Entry", "Missing Fields"],
    changelogIncomplete.map(f => [f.link, f.missing])
  );
}
\`\`\`

### archive/drafts class (pre-removal validation)
\`\`\`dataviewjs
const draftFiles = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.class === "revision")
  .where(p => p.file.path.includes("DRAFTS"));

let draftComplete = 0;
const draftIncomplete = [];

for (const file of draftFiles) {
  const hasStage = file.stage !== undefined && file.stage !== null;
  const hasStageStatus = file["stage-status"] !== undefined && file["stage-status"] !== null;
  const hasFormat = file.format !== undefined && file.format !== null;
  const hasTitle = file.title !== undefined && file.title !== null;
  const hasDraftTitle = file.draftTitle !== undefined && file.draftTitle !== null;
  const hasWorkflow = file.workflow !== undefined && file.workflow !== null;
  const hasScenes = file.scenes && Array.isArray(file.scenes) && file.scenes.length > 0;
  
  if (hasStage && hasStageStatus && hasFormat && hasTitle && hasDraftTitle && hasWorkflow && hasScenes) {
    draftComplete++;
  } else {
    const missing = [];
    if (!hasStage) missing.push("stage");
    if (!hasStageStatus) missing.push("stage-status");
    if (!hasFormat) missing.push("format");
    if (!hasTitle) missing.push("title");
    if (!hasDraftTitle) missing.push("draftTitle");
    if (!hasWorkflow) missing.push("workflow");
    if (!hasScenes) missing.push("scenes");
    
    draftIncomplete.push({
      link: file.file.link,
      missing: missing.join(", ")
    });
  }
}

dv.paragraph(\`**Draft Snapshots**: \${draftComplete} complete, \${draftIncomplete.length} incomplete (⚠️ *pre-removal validation*)\`);

if (draftIncomplete.length > 0) {
  dv.paragraph(\`⚠️ These drafts are incomplete and should not be removed from the workflow:\`)
  dv.table(
    ["Draft", "Missing Fields"],
    draftIncomplete.map(f => [f.link, f.missing])
  );
} else if (draftComplete > 0) {
  dv.paragraph(\`✓ All draft snapshots are complete and eligible for archival.\`);
}
\`\`\`

### changelog staleness
\`\`\`dataviewjs
const allChangelogs = dv.pages('#${ storyNameNoSpaces }')
  .where(p => p.category && p.category.includes("changelog"))
  .where(p => !p.file.path.includes("CHANGELOG.md"));
  .sort(p => p.created, 'desc');

if (allChangelogs.length === 0) {
  dv.paragraph("No changelog entries found.");
} else {
  const lastEntry = allChangelogs[0];
  const lastDate = lastEntry.created ? dv.date(lastEntry.created) : null;
  
  if (!lastDate) {
    dv.paragraph("Last changelog entry has no date.");
  } else {
    const daysSince = Math.floor((dv.date("today") - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) {
      dv.paragraph(\`✓ Last work session: today\`);
    } else if (daysSince === 1) {
      dv.paragraph(\`Last work session: 1 day ago\`);
    } else {
      dv.paragraph(\`⚠️ Last work session: \${daysSince} days ago (\${lastDate.toFormat("yyyy-MM-dd")})\`);
    }
  }
}
\`\`\`

### stage transitions (all time)
\`\`\`dataview
TABLE WITHOUT ID
	file.link as Entry,
	created as Date,
	stage-transition as Transition
FROM
	#${ storyNameNoSpaces }
WHERE
	contains(category, "changelog") AND
	stage-transition
SORT
	date DESC
\`\`\`

### draft snapshots existence
\`\`\`dataviewjs
const stages = ["serial-draft", "reassembly", "1st-edit", "2nd-edit", "3rd-edit", "final"];
const archiveFolder = dv.current().file.folder;
const basePath = \`\${archiveFolder}/DRAFTS\`;

const results = [];
for (const stage of stages) {
  const path = \`\${basePath}/\${stage}\`;
  const folder = app.vault.getAbstractFileByPath(path);
  const exists = folder ? "✓" : "⚠️ Missing";
  results.push([stage, exists]);
}

dv.table(["Stage", "Snapshot Status"], results);
\`\`\`

---

# archive operations guide

## purpose

This guide describes two archival systems used across story projects:

1. **CHANGELOG capture** for daily story progression and project evolution.
2. **DRAFTS archival** for revision-stage snapshots during editorial promotion.

The practices below are project-agnostic and intended for any multi-draft fiction workflow.

---

## 1. CHANGELOG capture (story progression + project evolution)

### scope

The changelog records both creative and operational movement for each work session:

- Story progression (scene development, structural updates, character/arc movement)
- Project evolution (workflow changes, metadata adjustments, file organization)
- Publication-adjacent prep (archive updates, output readiness, release logistics)

### required record fields

Each changelog entry should include:

- **Date** of work session
- **Session type** (\`writing\` | \`project\` | \`editorial\` | \`planning\` | \`mixed\`)
- **Digital assistant attribution** (if applicable; should only ever be about generating changelogs or other such documentation)
- **Commit SHA** (filled after commit)
- **Branch** used for changes
- **Commit message keywords** (see [[#commit message conventions]] for discovery)
- **Scenes edited** (count of scene files modified)
- **Files modified** (total count including scenes)
- **Files created** (new files this session)
- **Files archived** (files moved to archive)
- **Stage transition** (stage name if promoted, e.g., \`1st-edit\`, or empty)
- **Tags** for retrieval and reporting

### content requirements

Each entry should capture, at minimum:

- What changed
- Which files were modified/created/archived
- Why key decisions were made
- What remains next (writing-specific priorities)

### writing vs. project distinction

To keep records useful over time:

- Track **writing outcomes** as narrative progress
- Track **project outcomes** as process, tooling, and organizational changes
- Keep next steps focused on actionable writing milestones

### quality standard

A valid changelog entry must allow a collaborator to reconstruct:

- Session intent
- Concrete outputs
- Decision rationale
- Immediate next writing actions

### CHANGELOG-template

A \`CHANGELOG-template.md\` is provided. Each session should be topped off with the generation of a changelog using this template. It will help maintain consistency in capturing historical data, and provide a comprehensive and granular review of the state of the story and the project.

### commit message conventions

To maintain discoverability of commits across the project lifecycle, use standardized keywords in commit messages:

- **\`feat:\`** for new features, scenes, or structural additions (e.g., \`feat: add reassembly scene expansion\`)
- **\`refactor:\`** for reorganization, frontmatter updates, or metadata restructuring (e.g., \`refactor: update scene context links\`)
- **\`archive:\`** for snapshot creation and stage transitions (e.g., \`archive: snapshot of reassembly completion\`)
- **\`docs:\`** for documentation, template, or workflow updates (e.g., \`docs: update revision workflow spec\`)
- **\`fix:\`** for corrections, continuity fixes, or unresolved comment resolution (e.g., \`fix: resolve timeline inconsistency\`)

These prefixes enable quick discovery via git search without requiring changelog lookups.

### git commands for commit discovery

\`\`\`bash
# Find all scene feature additions
git log --grep="feat:" --oneline

# Find all archive/stage transitions
git log --grep="archive:" --oneline

# Find all revisions in a specific stage
git log --grep="reassembly" --oneline

# Find commits by date range
git log --since="2026-02-01" --until="2026-03-01" --oneline

# Find all commits touching a specific scene
git log -- "reassembly/scene-name.md"

# Find commits containing editorial keywords
git log --grep="revision\|editorial\|feedback" --oneline
\`\`\`


---

## 2. DRAFTS archival process (revision workflow)

### core principle

Each revision stage is an independent working draft. When promoting to a new stage, preserve the previous stage as an immutable snapshot.

### canonical archive location

Store stage snapshots under:

- \`ARCHIVE/DRAFTS/[revision stage]\`

Examples:

- \`ARCHIVE/DRAFTS/serial-draft\`
- \`ARCHIVE/DRAFTS/reassembly\`
- \`ARCHIVE/DRAFTS/1st-edit\`

### stage transition protocol

Before promotion to the next revision stage:

1. Confirm current-stage editorial comments are resolved or explicitly marked unresolved.
2. Create/update the snapshot in \`ARCHIVE/DRAFTS/[revision stage]\`.
3. Preserve the stage as a stable historical record before additional edits continue elsewhere.

During promotion:

1. Copy or migrate scene files into the next stage workspace.
2. Update stage metadata to reflect the new revision stage.
3. Reset stage-progress fields for the new pass if copying scene files.
4. Extend revision-history tracking while preserving prior stage history.

After promotion:

1. Record the transition in the session changelog.
2. Commit archive and stage-promotion changes with explicit transition language.

### metadata expectations across stages

For reliable lineage and archival integrity, maintain consistent scene metadata for:

- Current revision stage
- Source linkage to prior scene(s)/chapter(s)
- Stage progress state
- Revision history entries by stage/editor/date/focus

### archival integrity rules

- Archived stage snapshots are historical records, not active drafting spaces.
- New revision work happens only in the promoted stage.
- If rework is required, create a new archival event rather than overwriting prior history.

---

## operational governance

### end-of-session minimum

A session is complete only when both are true:

- CHANGELOG entry is created/updated with accurate session outcomes.
- DRAFTS archival state reflects any revision-stage transition performed that session.

### audit readiness

At any time, the archive should answer:

- What changed today?
- Which revision stage is active?
- What prior stage snapshot exists?
- What is the next writing priority?

---

*When the manuscript shifts, the archive remembers. Precision in record-keeping is what keeps long-form storytelling coherent across drafts, editors, and time.*
`
}

/**
 * Generates a standardized changelog entry template.
 * 
 * Creates a template for recording work session details including story development,
 * technical updates, publication preparation, commit information, and next steps.
 * Follows structured format for tracking files modified/created/archived and
 * maintaining project history with proper metadata.
 * 
 * @function generateChangelogTemplate
 * @param {Object} options - Template options
 * @param {string} options.storyNameNoSpaces - Story name formatted for tags (lowercase, hyphenated)
 * @returns {string} Markdown template with frontmatter for changelog entry creation
 */
function generateChangelogTemplate(options) {
	
	const {
		storyNameNoSpaces
	} = options;

	return `---
class: archive
category:
  - changelog
created:
updated:
session-type:
digital-assistant:
commit-sha:
branch: main
scenes-edited: 0
files-modified: 0
files-created: 0
files-archived: 0
stage-transition:
tags:
  - changelog
  - ${ storyNameNoSpaces }
---

# Changelog - \{\{date:YYYY-MM-DD\}\}

*some thematic element from the story*

> [!important] About the \`created\` and \`updated\` properties
> These two properties are managed by a plugin; leave these two fields blank and remove this callout when generating a new changelog. The fields will be filled automatically. 

## Changes Made

### Story Development
- [ ] Scene additions/modifications
- [ ] Character development progress  
- [ ] Plot advancement
- [ ] Dialogue refinements

### Technical Updates
- [ ] File organization improvements
- [ ] Metadata updates
- [ ] Template modifications
- [ ] Workflow enhancements

### Publication Preparation
- [ ] Social media integration updates
- [ ] Archive management
- [ ] Output generation improvements

## Detailed Change Log

### Files Modified
- \`file-name.md\`: Description of changes
- \`other-file.md\`: Description of changes

### New Files Created
- \`new-file.md\`: Purpose and content description

### Files Removed/Archived
- \`old-file.md\`: Reason for removal/archiving

## Conversation Summary

### Key Discussions
Brief summary of any significant conversations that drove today's changes.

### Decisions Made
Important project decisions and their rationale.

### Digital Assistant Contributions
*If digital-assistant field is filled above, describe the AI's role in advancing the project:*

## Commit Information

**Commit SHA**: [To be filled during commit process]
**Commit Message**: [To be filled during commit process]
*Use keyword prefixes for discoverability: \`feat:\` (new scenes), \`refactor:\` (structural), \`archive:\` (snapshots), \`docs:\` (documentation), \`fix:\` (corrections). See [[Calamity/Backstage/House/ARCHIVE/ARCHIVE#commit message conventions|commit conventions]] for details.*
**Files in Commit**: [To be filled during commit process]

## Next Steps (Writing-Specific)

### Immediate Writing Tasks
- [ ] Next scene to develop
- [ ] Character arcs to advance  
- [ ] Plot points to address
- [ ] Dialogue scenes to craft

### Upcoming Story Milestones
- [ ] Scene completion targets
- [ ] Chapter/section goals
- [ ] Character development objectives
- [ ] Narrative arc progressions

### Creative Considerations
- [ ] Atmosphere/tone adjustments needed
- [ ] Pacing concerns to address
- [ ] Horror elements to enhance
- [ ] Character motivations to deepen

---

*some other thematic element from the story*

`
}