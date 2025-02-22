"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    const platform = os.platform();
    const executable = platform === 'win32' ? 'powdr-lsp.exe' : 'powdr-lsp';
    //const serverPath = context.asAbsolutePath(
    //    path.join('server', 'bin', executable)
    //);
    const serverPath = path.join(__dirname, '../../../powdr-lsp/target/debug/powdr-lsp');
    const serverOptions = {
        run: {
            command: serverPath,
            transport: node_1.TransportKind.stdio,
        },
        debug: {
            command: serverPath,
            transport: node_1.TransportKind.stdio,
        }
    };
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'powdr' }, { scheme: 'file', language: 'powdr-asm' }],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.powdrrc')
        }
    };
    client = new node_1.LanguageClient('powdr-language-server', 'Powdr Language Server', serverOptions, clientOptions);
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map