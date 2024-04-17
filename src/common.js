function createToggleEye(callback, children) {
  const attr = 'checked';
  const iconOn = 'mdi-eye';
  const iconOff = 'mdi-eye-off-outline';

  const eye = document.createElement('div');
  eye.classList.add('toggle-icon', 'mdi', iconOn);
  eye.setAttribute(attr, '');

  // Set parent eye for each child.
  for (const child of children || []) {
    child.parentToggleEye = eye;
  }

  eye.onclick = () => {
    eye.toggleAttribute(attr);
    eye.classList.toggle(iconOn);
    eye.classList.toggle(iconOff);

    const enabled = eye.hasAttribute(attr);

    // Toggle children.
    for (const child of children || []) {
      if (child.hasAttribute(attr) != enabled) {
        child.toggleAttribute(attr);
        child.classList.toggle(iconOn);
        child.classList.toggle(iconOff);
      }
    }

    if (eye.parentToggleEye) {
      eye.parentToggleEye.refreshToggle();
    }

    if (callback) callback(eye.hasAttribute(attr));
  }

  // Update toggle if all children are disabled or more than one is enabled.
  eye.refreshToggle = () => {
    let enabled = false;

    for (const child of children || []) {
      enabled ||= child.hasAttribute(attr);
    }

    if (enabled != eye.hasAttribute(attr)) {
      eye.toggleAttribute(attr);
      eye.classList.toggle(iconOn);
      eye.classList.toggle(iconOff);
    }
  }

  return eye;
}