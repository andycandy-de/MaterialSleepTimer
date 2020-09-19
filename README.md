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

The UI is clean and simple. 

![mts_main](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_main.png)

The countdown timer and the circle visualize the remaining time.

![mst_main_running](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_main_running.png)

A simple edit page to change the countdown time.

![mst_edit](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_edit.png)

With the settings page the shutdown command can be changed. It's also possible to change various default values.

![mst_settings](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_settings.png)

If the overlay time is reached the overlay is shown.

![mst_overlay_01](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_overlay_01.png)

The overlay shows simple control elements to extend the countdown, to stop the countdown or to immediately shutdown.

![mst_overlay_02](https://raw.githubusercontent.com/andycandy-de/MaterialSleepTimer/master/readmeAssets/mst_overlay_02.png)