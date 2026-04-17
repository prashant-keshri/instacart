Summary of All Files with Editable Configuration
File	Purpose	Key Editable Variables
common.css	Global styles	:root color variables
common.js	Global functions	SITE_CONFIG object at top
index.html	Homepage	Uses SITE_CONFIG values
categories.html	Category page	Uses SITE_CONFIG values
orders.html	Orders page	Uses SITE_CONFIG values
account.html	Account page	Uses SITE_CONFIG values
description.html	Product details	Uses SITE_CONFIG values
product.json	Product data	Add/edit products
How to Customize
Change Website Colors
Edit the :root section in common.css:

css
--green-primary: #2e7d32;  /* Change to any color */
--orange-primary: #f97316; /* Change to any color */
Change Cart Settings
Edit the SITE_CONFIG object at the top of common.js:

javascript
const SITE_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 499,  // Change to 299 for lower threshold
  MAX_CART_QUANTITY: 20,         // Change max items per product
  PLATFORM_FEE: 9,               // Change platform fee
  DELIVERY_CHARGE: 40,           // Change delivery charge
  DEFAULT_THEME: 'dark',         // Change to 'light' for light mode default
};
Change Show More Settings
Edit the SITE_CONFIG object:

javascript
DEFAULT_INITIAL_ITEMS: 12,    // Products shown initially
DEFAULT_LOAD_MORE_ITEMS: 6,   // Products per "Show More" click
DEFAULT_MAX_CYCLES: 10,       // Maximum cycles before stopping
All files are now properly organized with clear section markers and easy-to-edit configuration variables at the top of each file!