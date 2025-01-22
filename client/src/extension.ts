import * as path from 'path';
import * as os from 'os';
import { workspace, ExtensionContext } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const platform = os.platform();
    const executable = platform === 'win32' ? 'powdr-lsp.exe' : 'powdr-lsp';

    //const serverPath = context.asAbsolutePath(
    //    path.join('server', 'bin', executable)
    //);

    const serverPath = path.join(__dirname, '../../../powdr-lsp/target/debug/powdr-lsp');

    const serverOptions: ServerOptions = {
        run: {
            command: serverPath,
            transport: TransportKind.stdio,
        },
        debug: {
            command: serverPath,
            transport: TransportKind.stdio,
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'powdr' }, { scheme: 'file', language: 'powdr-asm' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/.powdrrc')
        }
    };

    client = new LanguageClient(
        'powdr-language-server',
        'Powdr Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
