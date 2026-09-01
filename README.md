📋 Inventory (Item) APIs
#	Problem Statement	Method	Route	Access
1	Create a new pizza/item with name, category, price, sizes, and toppings	POST	/api/inventory	Admin
2	Fetch all available items for the menu page	GET	/api/inventory	Public
3	Fetch a single item's full details by its ID	GET	/api/inventory/:id	Public
4	Update an existing item's price, availability, or details	PUT	/api/inventory/:id	Admin
5	Delete an item from inventory permanently	DELETE	/api/inventory/:id	Admin
6	Toggle an item's availability (in-stock/out-of-stock) without full update	PATCH	/api/inventory/:id/availability	Admin
7	Fetch items filtered by category (pizza/sides/drinks/desserts)	GET	/api/inventory/category/:category	Public