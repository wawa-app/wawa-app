export const cameraFrameStyle = { height: 440, maxWidth: 340 };
export const captureControlsStyle = { maxWidth: 340 };

export const challengeTw = {
  screen: 'flex-1 bg-Base-Background',
  blackStatus: 'h-8 bg-Base-Surface',
  shortBlackStatus: 'h-6 bg-black -mx-8',
  whiteTopSpacer: 'h-8 bg-Base-Surface',

  topTargetBar: 'flex-row items-center bg-Base-Surface px-14 py-3',
  topTargetBarWide: 'flex-row items-center bg-Base-Surface px-16 py-3',
  targetThumb: 'h-24 w-24 overflow-hidden rounded-md bg-Neutral-Gray-200',
  targetPlaceholder: 'h-full w-full items-center justify-center',
  targetImage: 'h-full w-full',
  targetTextWrap: 'ml-10 flex-1',
  targetLabel: 'mb-3 text-xs font-geologica-bold uppercase tracking-widest text-Neutral-Gray-500',
  targetName: 'text-base font-geologica-bold text-Base-OnBackground',
  targetNameWithButton: 'mb-3 text-base font-geologica-bold text-Base-OnBackground',
  changeObjectButton: 'self-start rounded-full bg-Brand-Secondary px-5 py-2.5',
  changeObjectText: 'text-sm font-geologica-bold text-white',

  challengeStartContent: 'min-h-full items-center bg-white px-8 pb-12 pt-8',
  challengeStartTitle: 'self-start text-xs font-extrabold uppercase tracking-widest text-slate-400',
  challengeStartTarget: 'mt-3 h-[320px] w-full overflow-hidden rounded-[22px] border-4 border-black bg-neutral-100',
  challengeStartHelp: 'mt-5 text-center text-base leading-6 text-slate-600',
  primaryButton: 'mt-6 h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-black',
  primaryButtonText: 'text-lg font-bold text-white',
  secondaryButton: 'mt-3 h-14 w-full flex-row items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50',
  secondaryButtonText: 'text-lg font-bold text-black',

  captureBody: 'flex-1 items-center px-6 pt-4',
  cameraFrame: 'w-full overflow-hidden rounded-[22px] border-4 border-Brand-Primary bg-Neutral-Gray-200',
  captureControls: 'mt-5 w-full flex-row items-center justify-center',
  roundIconButton: 'h-11 w-11 items-center justify-center rounded-full bg-Neutral-Gray-200',
  shutterButton: 'h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-Brand-Primary bg-Base-Surface',
  shutterInner: 'h-[58px] w-[58px] rounded-full bg-Base-Surface',
  permissionScreen: 'flex-1 items-center justify-center bg-Base-Background px-8',
  permissionIcon: 'mb-3 text-5xl',
  permissionTitle: 'mb-2 text-xl font-geologica-bold text-Base-OnBackground',
  permissionText: 'mb-7 text-center text-sm text-Neutral-Gray-500',
  permissionButton: 'rounded-full bg-Brand-Primary px-6 py-3',
  permissionButtonText: 'text-base font-geologica-bold text-Base-OnPrimary',

  comparingBody: 'flex-1 items-center px-9 pt-4',
  comparingCandidateImage: 'h-full w-full',
  comparingFallback: 'h-full w-full items-center justify-center',
  scanBand: 'absolute left-0 right-0 h-16 bg-white/35',
  scanPulse: 'absolute left-8 right-8 top-1/2 h-24 rounded-full bg-white/40',
  scanBorder: 'absolute inset-0 border-2 border-[#FF6D0066]',
  comparingText: 'mt-5 text-2xl font-geologica-bold text-Base-OnBackground',

  resultContent: 'min-h-full px-8 pb-12',

  // Mission accomplished (success) — two-step flow
  successStepBody: 'flex-1 items-center pt-14',
  successActions: 'mt-8 w-full',
  uniRewardCenter: 'w-full flex-1 items-center justify-center',
  uniRewardBottom: 'w-full',
  successTitle: 'text-center text-[34px] font-geologica-bold leading-[40px] text-Base-OnBackground',
  resultCopy: 'mt-4 text-center text-[16px] leading-6 text-Neutral-brandWarm-800',
  levelText: 'mt-6 text-center text-[16px] font-geologica-medium text-Base-OnBackground',

  xpCard: 'w-full rounded-2xl bg-Uni-100 px-5 py-4',
  xpHeader: 'mb-2 flex-row justify-between',
  xpLabel: 'text-[14px] font-geologica-bold text-Base-OnBackground',
  xpValue: 'text-[14px] font-geologica-medium text-Base-OnBackground',
  xpTrack: 'h-3 overflow-hidden rounded-full bg-white',
  xpFill: 'h-full rounded-full bg-Uni-600',

  primaryActionButton: 'h-[54px] w-full items-center justify-center rounded-2xl bg-Brand-Primary',
  primaryActionText: 'text-[16px] font-geologica-bold text-Base-OnPrimary',
  secondaryActionButton: 'mt-3 h-[54px] w-full items-center justify-center rounded-2xl bg-Brand-Secondary',
  secondaryActionText: 'text-[16px] font-geologica-bold text-Base-OnSecondary',

  // Mission failed (failure)
  wrongTitle: 'text-center text-[34px] font-geologica-bold leading-[40px] text-Base-OnBackground',
  wrongCopy: 'mt-4 text-center text-[16px] leading-6 text-slate-500',

  streakCard: 'mt-8 w-[92%] rounded-3xl bg-slate-900 px-6 py-7',
  streakHeader: 'flex-row items-center justify-center',
  streakCount: 'ml-3 text-4xl font-light text-white',
  streakLabel: 'mt-2 text-center text-xs uppercase tracking-widest text-slate-400',
  streakDays: 'mt-6 flex-row justify-between',
  streakDayDone: 'h-6 w-6 items-center justify-center rounded-full bg-white',
  streakDayEmpty: 'h-6 w-6 items-center justify-center rounded-full bg-slate-700',

  emptyScreen: 'flex-1 items-center justify-center bg-white px-8',
  emptyIcon: 'mb-4 text-6xl',
  emptyTitle: 'mb-2 text-xl font-bold text-black',
  emptyText: 'text-center text-sm text-slate-500',
  errorScreen: 'flex-1 items-center justify-center bg-white px-8',
  errorTitle: 'mt-3 text-lg font-bold text-black',
  errorMessage: 'mt-2 text-center text-sm text-slate-500',
};
