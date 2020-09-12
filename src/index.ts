import execa from "execa";
import tempDirectory from "temp-dir";
import path from "path";
import { stdout } from "process";

(async () => {
	try {
		const { stdout: gitVersion } = await execa("git", ["version"]);
		console.log(`1. git version: ${gitVersion}`);
		const { stdout: ncuVersion } = await execa("ncu", ["--version"]);
		console.log(`2. ncu version: ${ncuVersion}`);
		const projectPath = path.join(tempDirectory, "fast-ncu-project");
		console.log(`cloning to ${projectPath}`);
		await execa("git", ["clone", "git@github.com:ShaunLWM/NUSWhispersBot.git", projectPath]);
		await execa("cd", [projectPath]);
		console.log(`gonna ncu`);
		const opts = execa.sync("ncu", ["-u"]);
		console.log(opts);
		const { stdout: changes } = await execa("git", ["status"]);
		const matches = changes.match(/Untracked files:/g);
		if (matches === null || matches.length < 1) {
			return console.log(`no changes`);
		}

		console.log(`new changes`);
		await execa("git", ["add", "."]);
		await execa("git", ["commit", "-m", "🚀 fast-ncu - update packages"]);
		await execa("git", ["push"]);
		await execa("rm", ["-rf", projectPath]);
	} catch (e) {
		console.error(e);
	}
})();
