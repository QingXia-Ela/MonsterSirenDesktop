import { AnyAction } from '@reduxjs/toolkit';

export interface logoShowLogo extends AnyAction {
  type: 'logo/showLogo';
}

export interface logoHideLogo extends AnyAction {
  type: 'logo/hideLogo';
}

export type LogoActions = logoShowLogo | logoHideLogo;
