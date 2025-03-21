// utils.js

export function preventTextSelection(e) {
    e.preventDefault();
  }
  
  export function handleTouchStart(e, isDraggingRef, scrollWheelRef, startAngleRef) {
    isDraggingRef.current = true;
    const rect = scrollWheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    startAngleRef.current = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
  }
  
  export function handleTouchMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems) {
    if (!isDraggingRef.current || !e.touches || e.touches.length === 0) return;
  
    const rect = scrollWheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    const deltaAngle = currentAngle - startAngleRef.current;
  
    const sensitivity = 0.05;
    const scrollAmount = Math.round(deltaAngle / sensitivity);
  
    if (scrollAmount !== 0) {
      setSelectedIndex((prevIndex) => {
        let newIndex = prevIndex - scrollAmount;
        if (newIndex < 0) newIndex = menuItems.length + (newIndex % menuItems.length);
        if (newIndex >= menuItems.length) newIndex = newIndex % menuItems.length;
        return newIndex;
      });
      startAngleRef.current = currentAngle;
    }
  }
  
  export function handleTouchEnd(isDraggingRef) {
    isDraggingRef.current = false;
  }
  
  export function handleMouseStart(e, isDraggingRef, scrollWheelRef, startAngleRef) {
    isDraggingRef.current = true;
    const rect = scrollWheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  }
  
  export function handleMouseMove(e, isDraggingRef, scrollWheelRef, startAngleRef, selectedIndex, setSelectedIndex, menuItems) {
    if (!isDraggingRef.current) return;
  
    const rect = scrollWheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const deltaAngle = currentAngle - startAngleRef.current;
  
    const sensitivity = 0.05;
    const scrollAmount = Math.round(deltaAngle / sensitivity);
  
    if (scrollAmount !== 0) {
      setSelectedIndex((prevIndex) => {
        let newIndex = prevIndex - scrollAmount;
        if (newIndex < 0) newIndex = menuItems.length + (newIndex % menuItems.length);
        if (newIndex >= menuItems.length) newIndex = newIndex % menuItems.length;
        return newIndex;
      });
      startAngleRef.current = currentAngle;
    }
  }
  
  export function handleMouseEnd(isDraggingRef) {
    isDraggingRef.current = false;
  }