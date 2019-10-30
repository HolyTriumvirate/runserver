// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');
import {Uri} from 'vscode';
const {spawn} = require("child_process");
const child = spawn("pwd");
const EventEmitter = require('events');
const terminal = require('child_process').spawn('bash');
const terminal2 = require('child_process').spawn('bash');
const kill = require('kill-port');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "exttwo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		var temp = vscode.window.activeTextEditor.document.fileName;
		//alternatively
		// vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1];
		//see https://www.youtube.com/watch?v=OhfOcqSU62g&t=535s timestamp 10:33
			  
		var base = path.dirname(temp);
		console.log(temp, "first run alarm");

		try {
			const data = fs.readFileSync(temp,'utf8')
			console.log(data)
			console.log(typeof data)
			console.log(data.search(/app.listen\(/))
			let lookup = data.search(/app.listen\(/)
			let disp = 0;
			while(data[lookup+disp+11] === " "){
				disp++;
			}
			let target = data.slice(lookup+11+disp,lookup+15+disp)
			console.log('space trunk: ',target, target.length)
		} catch (err){
			console.log(err)
		}
		//console.log(data);//check
		console.log("base:", base)

		terminal.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});
		
		terminal.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});
		
		setTimeout(function() {
			console.log('Sending stdin to terminal');
			terminal.stdin.write('echo "Hello $USER. Your machine directory might be:"\n');
			terminal.stdin.write('uptime\n');
			terminal.stdin.write('pwd\n');
			terminal.stdin.write(`echo "${__dirname}"\n`)
			terminal.stdin.write(`node ${base}/index.js\n`)
			console.log('Ending terminal session');
			terminal.stdin.end();
		}, 1000);

		// try {
		// 	const dato = fs.readFileSync('stuff.txt','utf8')
		// 	console.log('new stuff is real: ', dato)
		// 	console.log(typeof dato)
		// } catch (err){
		// 	console.log(err)
		// }
		

		// const isthis = Uri.file('/stuff.txt')
		// const writeData = Buffer.from('thisisnewtext','utf8')
		// console.log('isthis: ',isthis, 'that was')
	



		// vscode.workspace.fs.writeFile(isthis,writeData).then(()=>{
		// 	console.log('did something')
		// }).catch(err=>{
		// 		if (err){
		// 			console.log(err)
		// 		}
		// 	}
		// )



		vscode.window.showWarningMessage(JSON.stringify(vscode.workspace));
		

	});

	let posable = vscode.commands.registerCommand('extension.posable', () => {
		// The code you place here will be executed every time your command is executed


		var temp = vscode.window.activeTextEditor.document.fileName;
		//alternatively
		// vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1];
		//see https://www.youtube.com/watch?v=OhfOcqSU62g&t=535s timestamp 10:33
			  
		var base = path.dirname(temp);
		console.log(temp, "second run alarm");

		terminal2.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
		});
		
		terminal2.on('exit', function (code) {
			console.log('child process exited with code ' + code);
		});

		try {
			const data = fs.readFileSync(temp,'utf8')
			console.log(data)
			console.log(typeof data)
			console.log(data.search(/app.listen\(/))
			let lookup = data.search(/app.listen\(/)
			let disp = 0;
			while(data[lookup+disp+11] === " "){
				disp++;
			}
			let target = data.slice(lookup+11+disp,lookup+15+disp)
			console.log('space trunk: ',target, target.length)

			
			setTimeout(function(){
				//console.log('kill $(lsof -t -i:'+target+')\n');
				terminal2.stdin.write('kill $(lsof -t -i:'+target+')\n');
				//terminal2.stdin.write('kill $(lsof -t -i:4000)\n');
				terminal2.stdin.end();
				},1000)


		} catch (err){
			console.log(err)
		}
		
		


		const date = new Date().toString();
		// Display a message box to the user
		vscode.window.showInformationMessage(date);
	});


	context.subscriptions.push(disposable, posable);
}



// this method is called when your extension is deactivated
export function deactivate() {}
