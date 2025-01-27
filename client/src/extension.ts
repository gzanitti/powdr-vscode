import * as path from 'path';
import * as os from 'os';
import { workspace, ExtensionContext, window, Progress, ProgressLocation } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // Show progress indicator
    window.withProgress({
        location: ProgressLocation.Window,
        title: "Powdr Language Server",
    }, async (progress: Progress<{ message?: string }>) => {
        progress.report({ message: "Starting..." });

        const platform = os.platform();
        const executable = platform === 'win32' ? 'powdr-lsp.exe' : 'powdr-lsp';

        const serverPath = context.asAbsolutePath(
            path.join('server', 'bin', executable)
        );

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

        try {
            await client.start();
            progress.report({ message: "Ready" });
        } catch (error) {
            progress.report({ message: "Failed to start" });
            throw error;
        }
    });
}
export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
