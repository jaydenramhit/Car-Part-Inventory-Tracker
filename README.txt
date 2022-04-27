Endpoints to try:
/ - home message
/* - error message given the entered endpoint is not one of the following
/cars - (GET) Lists all cars in the database
/cars/brand - (GET) Lists all cars that belong to the same brand (see below for viable brands)
/cars - (POST) Add car to database given the data in the request body (see below for viable post request bodies)
/cars/id - (PUT) Update a car given it's id and the price data in the request body (see below for viable put request bodies)
/cars/id - (DELETE) Delete a car given it's id

VIABLE POST REQUEST BODIES:
{
    "model" : "Camry",
    "brand" : "Toyota",
    "modelYear" : 2011,
    "price" : 4000.50
}

{ 
    "model": "Focus", 
    "brand": "Ford", 
    "modelYear": 2022, 
    "price": 25500.99 
}

{ 
    "model": "BRZ", 
    "brand": "Subaru", 
    "modelYear": 2008, 
    "price": 10500.99 
}

{ 
    "model": "A4", 
    "brand": "Audi", 
    "modelYear": 2022, 
    "price": 44500.99 
}

VIABLE PUT REQUEST BODIES:
{ price: 5000 }
{ price: 0.01 }

VIABLE BRAND NAMES:
[ "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu", "Dodge", "Donkervoort", "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Honda", "Hummer", "Hyundai", "Infiniti", "Iveco", "Jaguar", "Jeep", "Kia", "KTM", "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "Lexus", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo" ];