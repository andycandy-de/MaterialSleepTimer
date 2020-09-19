import { app, BrowserWindow } from 'electron';
import * as process from 'process';

const ffi = require('ffi-napi');
const ref = require('ref-napi');

export class ForceFocus {

    readonly window: any;

    readonly GetAsyncKeyState: any;
    readonly keybd_event: any;

    constructor() {

        if (this.isWindows()) {

            const _void = ref.types.void;
            const short = ref.types.short;
            const byte = ref.types.byte;
            const ulong = ref.types.ulong;
            const int = ref.types.int;

            this.window = ffi.Library('user32' ,{
                'GetAsyncKeyState': [short, [int]],
                'keybd_event': [_void, [byte, byte, ulong, ulong]],
            });

            this.GetAsyncKeyState = this.window['GetAsyncKeyState'];
            this.keybd_event = this.window['keybd_event'];
        }
    }

    public forceFocus(browserWindow: BrowserWindow) : void {

        if (!this.isWindows()) {
            browserWindow.show();
            app.focus();

            return;
        }

        const VK_MENU = 0x12;
        const KEYEVENTF_EXTENDEDKEY = 0x0001;
        const KEYEVENTF_KEYUP = 0x0002;

        let hwnd = browserWindow.getNativeWindowHandle();

        let pressed = false;
        if ((this.GetAsyncKeyState(VK_MENU) & 0x8000) == 0) {

            pressed = true;
            this.keybd_event(VK_MENU, 0, KEYEVENTF_EXTENDEDKEY | 0, 0);
        }

        app.focus();
        browserWindow.focus();
    
        if (pressed) {
            this.keybd_event(VK_MENU, 0, KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP, 0);
        }
    }
    
    private isWindows() : boolean {
        return process.platform === "win32";
    }

}