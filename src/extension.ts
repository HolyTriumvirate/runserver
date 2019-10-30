// requirements: note that terminal goes to 'serverOn,' and terminal2 goes to 'serverOff'
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const terminal = childProcess.spawn('bash');
const terminal2 = childProcess.spawn('bash');

// large exported function starts here; this controls the behavior of the two user commands
export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "exttwo" is active!');

	// first command: note that serverOn is a variable passed to subscriptions.push, and 'extension.serverOn' is required to interact with package.JSON' 
	// note that the variable only needs to match the variable below, not the string inline
	const serverOn = vscode.commands.registerCommand('extension.serverOn', function () {

		// to start the command body, we identify the path of the user's active file
		// note the bang operator, Typescript feature that lets the program handle a variable that could potentially be undefined (without the bang, the file would run locally, but throws an error upon attempt to upload to the VS Code Marketplace)
		const temp = vscode.window.activeTextEditor!.document.fileName;

		// next, we truncate to obtain the folder of the active file; WARNING: for sucess, we must be in the same folder as the server!
		const base = path.dirname(temp);

		// next, we activate two terminal methods to give us feedback on whether we sucessfully used a child process
		// note the Typescript (: any) used to handle unknown data inputs
		terminal.stdout.on('data', function (data: any) {
			console.log('stdout: ' + data);
		});
		
		terminal.on('exit', function (code: any) {
			console.log('child process exited with code ' + code);
		});
		
		// just below is the real core of the function, the child process: we write to a new terminal to run the index.js file in the folder specified by base
		//IMPORTANT: code will not run without the '\n' component--the CLI needs this explicit return command
		setTimeout(function() {
			console.log('Sending stdin to terminal');
			terminal.stdin.write(`node ${base}/index.js\n`);
			console.log('Ending terminal session');
			terminal.stdin.end();
		}, 1000);

		// this message pops up to the user upon completion of the command
		vscode.window.showInformationMessage('Your local server should be on.');
		
	});

	// second command: this follows much the same model as the first, with the difference being the readFileSync block
	const serverOff = vscode.commands.registerCommand('extension.serverOff', () => {

		const temp = vscode.window.activeTextEditor!.document.fileName;
			  
		terminal2.stdout.on('data', function (data: any) {
			console.log('stdout: ' + data);
		});
		
		terminal2.on('exit', function (code: any) {
			console.log('child process exited with code ' + code);
		});

		// this is a blocking (synchronous) call to the active file, populating 'data' as a string
		const data = fs.readFileSync(temp,'utf8');

		// to stop a localhost, we must first identify a port, and 'app.listen(' is a special string in the active file that is likely to be adjacent to the port number
		const lookup = data.search(/app.listen\(/);

		// this next segment is edge case handling for if the port number is separated from the start parentheses by some number of spaces
		let disp = 0;
		while(data[lookup+disp+11] === " "){
			disp++;
		};

		// in target, we slice the port out of the array (offsetting as required by the edge case test)
		const target = data.slice(lookup+11+disp,lookup+15+disp)
			
		// in the core of our function, we run a special command that finds and kills the port specified
		setTimeout(function(){
			terminal2.stdin.write('kill $(lsof -t -i:'+target+')\n');
			terminal2.stdin.end();
			},1000);

		vscode.window.showInformationMessage('Your local server should be off.');

	});

	// below, we help make both commands accessible to the user
	context.subscriptions.push(serverOn, serverOff);
};


// the below line of code helps deactivate the extension when appropriate
export function deactivate() {};