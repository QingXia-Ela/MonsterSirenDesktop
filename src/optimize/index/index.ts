// todo!: cannot running regularly
window.addEventListener('load', () => {
  const volume = JSON.parse(
    localStorage.getItem('PLAYER_SETTING') as string,
  ).volume;

  siren_audio_instance.setVolume(volume);
});
