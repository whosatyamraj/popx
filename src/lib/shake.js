export async function shakeForm(ctrl) {
  await ctrl.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.36 } });
  await ctrl.start({ x: 0, transition: { duration: 0.08 } });
}
