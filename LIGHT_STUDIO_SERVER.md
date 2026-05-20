# Light Studio Server

This local fork contains the customized light-theme HyperFrames Studio.

The light Studio project is now standalone. You do not need to open a
composition project first or run commands from `C:\Users\sohai\AICoding\Hyperframes`.
Start the Studio from this repo and pass the HyperFrames project you want to
preview with `-ProjectPath`.

## Start AI Terms

If the AI Terms project is copied into this repo under `videos`, run:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
corepack pnpm run studio:project -- -ProjectPath "videos\ai-terms-explained-without-jargon" -Relink
```

Then open:

```text
http://127.0.0.1:5192/#project/ai-terms-explained-without-jargon
```

Use `-Relink` when this Studio has already seen a project with the same folder
name from another location. It updates the saved Studio project link to point at
the copied local folder.

If you want to preview the original AI Terms folder instead, use its full path:

```powershell
corepack pnpm run studio:project -- -ProjectPath "C:\Users\sohai\AICoding\Hyperframes\videos\ai-terms-explained-without-jargon" -Relink
```

## Start Any HyperFrames Project

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
corepack pnpm run studio:project -- -ProjectPath "C:\path\to\hyperframes-project"
```

The command:

- verifies that the project path contains an `index.html`
- creates a project link under `packages\studio\data\projects`
- updates that link when `-Relink` is provided
- starts the light-theme Studio server
- prints the preview URL to open

By default, the Studio project name is the folder name from `-ProjectPath`.

## Custom Project Name

Use `-ProjectName` if you want the Studio URL name to differ from the folder
name:

```powershell
corepack pnpm run studio:project -- -ProjectPath "C:\path\to\hyperframes-project" -ProjectName "my-project"
```

Then open:

```text
http://127.0.0.1:5192/#project/my-project
```

## Alternate Port

If port `5192` is busy, use another port:

```powershell
corepack pnpm run studio:project -- -ProjectPath "C:\path\to\hyperframes-project" -Port 5193
```

Then open the same project name on that port:

```text
http://127.0.0.1:5193/#project/my-project
```

## Notes

- The server is long-running. Keep the terminal open while using the preview.
- If the browser already shows the preview, the server may already be running.
- The launcher script lives at `scripts\start-light-studio.ps1`.
- The package script is `studio:project` in `package.json`.
- If a project link already exists with the same name but points somewhere
  else, use `-Relink` to point that Studio project name at the new folder.
  Use a different `-ProjectName` only when you want both folders to appear as
  separate Studio projects.

## If Dependencies Are Missing

If startup reports missing Studio dependencies, run:

```powershell
cd C:\Users\sohai\AICoding\hyperframes-studio-light
corepack pnpm install --ignore-scripts
corepack pnpm --filter @hyperframes/core run build:hyperframes-runtime
```

Then start the server again:

```powershell
corepack pnpm run studio:project -- -ProjectPath "C:\path\to\hyperframes-project"
```
