// Select the tabs and product container elements
const tabs = document.querySelectorAll(".tabs li");
const products = document.querySelector(".products");
const productContainer = document.querySelector(".product-container");

// Define some variables to track the drag functionality
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;

// Add event listeners to the tabs
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(index));
});

// Add event listeners to the product container for touch and mouse events
productContainer.addEventListener("touchstart", touchStart);
productContainer.addEventListener("touchmove", touchMove);
productContainer.addEventListener("touchend", touchEnd);
productContainer.addEventListener("mousedown", dragStart);
productContainer.addEventListener("mouseup", dragEnd);
productContainer.addEventListener("mouseleave", dragEnd);
productContainer.addEventListener("mousemove", drag);

// Function to activate the selected tab
function activateTab(index) {
  currentIndex = index;
  const activeTab = document.querySelector(".tabs li.active");
  activeTab.classList.remove("active");
  tabs[currentIndex].classList.add("active");

  const productWidth = products.children[0].offsetWidth;
  prevTranslate = currentTranslate;
  currentTranslate = -1 * index * productWidth;
  setTransform(currentTranslate);
}

// Function to start the drag functionality
function dragStart(event) {
  event.preventDefault();
  if (event.type === "touchstart") {
    startPos = event.touches[0].clientX;
  } else {
    startPos = event.clientX;
  }

  isDragging = true;

  // Update prevTranslate to the current translate value
  prevTranslate = currentTranslate;
}

// Function to start the drag functionality
function dragStart(event) {
  event.preventDefault();
  if (event.type === "touchstart") {
    startPos = event.touches[0].clientX;
  } else {
    startPos = event.clientX;
  }

  isDragging = true;

  // Update prevTranslate to the current translate value
  prevTranslate = currentTranslate;

  // Calculate the current index based on the current translate position and product width
  const productWidth = products.children[0].offsetWidth;
  const newIndex = Math.round(-prevTranslate / productWidth);

  // Set the currentTranslate to the start position of the current product
  currentTranslate = -1 * newIndex * productWidth;
  setTransform(currentTranslate);
}

// Function to end the drag functionality
function dragEnd(event) {
  event.preventDefault();
  isDragging = false;

  // Calculate the final translate position based on the current index and product width
  const productWidth = products.children[0].offsetWidth;
  const finalTranslate = -1 * currentIndex * productWidth;

  // Set the currentTranslate to the final translate position
  currentTranslate = finalTranslate;
  setTransform(currentTranslate);
}

// Function to handle the drag functionality
function drag(event) {
  event.preventDefault();
  if (isDragging) {
    let currentPos = 0;
    if (event.type === "touchmove") {
      currentPos = event.touches[0].clientX;
    } else {
      currentPos = event.clientX;
    }

    const diff = currentPos - startPos;
    const productWidth = products.children[0].offsetWidth;

    if (prevTranslate + diff <= 0 && prevTranslate + diff >= -(products.children.length - 1) * productWidth) {
      currentTranslate = prevTranslate + diff;
      requestAnimationFrame(() => {
        setTransform(currentTranslate);
      });
    }
  }
}

// Functions to handle the touch events
function touchStart(event) {
  event.preventDefault();
  startPos = event.touches[0].clientX;
}

function touchMove(event) {
  event.preventDefault();
  const currentPos = event.touches[0].clientX;
  const diff = currentPos - startPos;
  const productWidth = products.children[0].offsetWidth;
  const moveAmount = productWidth / 10; // adjust the speed by changing the number

  if (diff > moveAmount && prevTranslate + productWidth <= 0) {
    currentTranslate = prevTranslate + productWidth;
    requestAnimationFrame(() => {
      setTransform(currentTranslate);
    });
    startPos = currentPos;
    prevTranslate = currentTranslate;
  } else if (diff < -moveAmount && prevTranslate - productWidth >= -(products.children.length - 1) * productWidth) {
    currentTranslate = prevTranslate - productWidth;
    requestAnimationFrame(() => {
      setTransform(currentTranslate);
    });
    startPos = currentPos;
    prevTranslate = currentTranslate;
  }
}

function touchEnd(event) {
  event.preventDefault();
  prevTranslate = currentTranslate;
}

// Function to update the transform property of the products element
function setTransform(translate) {
  products.style.transform = `translateX(${translate}px)`;

  // Get the current active tab
  const activeTab = document.querySelector(".tabs li.active");

  // Check if the current index should be updated
  const productWidth = products.children[0].offsetWidth;
  const newIndex = Math.round(-translate / productWidth);
  if (newIndex !== currentIndex) {
    currentIndex = newIndex;

    // Remove the active class from the current active tab
    activeTab.classList.remove("active");

    // Add the active class to the new active tab
    tabs[currentIndex].classList.add("active");
  }
}
