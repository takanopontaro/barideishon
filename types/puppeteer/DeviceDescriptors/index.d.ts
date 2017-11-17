type Devices = {
  [key: string]: Device;
};

type Device = {
  name: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };
};

declare const devices: Devices & Device[];

export = devices;
