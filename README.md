# Material Sleep Timer

This is a simple sleep timer implemented in typescript. With this sleep timer you can shutdown your PC after a defined time. Before the shutdown command is executed an overlay is showed which allowes to extend the countdown time. It's based on a electron angular template project which can be found here 'https://github.com/maximegris/angular-electron'.

- [x] Simple
- [x] Clean
- [x] Material
- [x] Overlay
- [x] Configurable

It's possible to change the shutdown command. I use this sleep timer app with the program psshutdown (https://docs.microsoft.com/en-us/sysinternals/downloads/psshutdown). With this program it's possible to hibernate the pc.

```
psshutdown.exe -d -t 0
```

This was not possible with the windows 'shutdown' program.

> This program is tested with windows

## Simple UI

![mts_main](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_main.png)
![mts_main_running](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mts_main_running.png)
![mst_edit](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_edit.png)
![mst_settings](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_settings.png)
![mst_overlay_01](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_overlay_01.png)
![mst_overlay_02](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_overlay_02.png)