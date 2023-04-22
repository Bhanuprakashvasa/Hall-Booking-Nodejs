const express = require("express");
const hall = express();
const PORT = 3000;
hall.use(express.json());

// already book rooms and customers in Hall
const myHall = [
  {
    roomName: "extra-large",
    seats: 882,
    amenities: "wifi,projection screen,AC",
    price: 3200,
    roomId: "EL-1",
    bookingDetails: [
      {
        customerName: "Jayanth",
        date: "2023-04-20",
        start: "12:00 AM",
        end: "11:59 PM",
        status: "confirmed"
      },
      {
        customerName: "Aishwarya",
        date: "2023-04-21",
        start: "12:00 AM",
        end: "11:59 PM",
        status: "confirmed"
      }
    ]
  },
  {
    roomName: "large",
    seats: 450,
    amenities: "wifi,projection screen,AC",
    price: 1300,
    roomId: "L-1",
    bookingDetails: [
      {
        customerName: "Mahesh",
        date: "2023-04-21",
        start: "12:00 AM",
        end: "11:59 PM",
        status: "confirmed"
      }
    ]
  }
];

// list all rooms and customers 
hall.get("/all", (req, res) => {
  try {
    res.json(myHall);
  } catch (error) {
    console.log(error);
  }

});


// 1. creating a room 
hall.post("/createRoom", (req, res) => {
  try {
    for (let i = 0; i < myHall.length; i++) {
      if (myHall[i].roomId == req.body.roomId) {
        return res.status(400).send({ error: "This Room Id already existed" });
      }
    }
    let roomCrate = {
      roomName: req.body.roomName,
      seats: req.body.seats,
      amenities: req.body.amenities,
      price: req.body.price,
      roomId: req.body.roomId,
      bookingDetails: []
    }
    myHall.push(roomCrate)
    res.status(200).json({ message: "Room Created Successfully" });
  } catch (error) {
    console.log(error);
  }

})


//2. booking a room

hall.post("/bookRoom", (req, res) => {
  try {
    for (let i = 0; i < myHall.length; i++) {
      if (myHall[i].roomId == req.body.roomId) {
        myHall[i].bookingDetails.forEach((book) => {
          if (req.body.date <= book.date) {
            return res.status(400).send({ error: "Already booked or Invaild Date" });
          }
        });
        let booking = {
          customerName: req.body.customerName,
          date: req.body.date,
          start: "12:00 AM",
          end: "11:59 PM",
          status: "confirmed",
        };
        res.status(200).json({ message: "Booked Successfully" });
        myHall[i].bookingDetails.push(booking);
      }
    }
    return res.status(400).send({ error: "Invaild RoomId" });
  } catch (error) {
    console.log(error);
  }
});


// 3.list all rooms with booked data 


hall.get("/listAllRooms", (req, res) => {
  try {
    let listAllRooms = []
    for (let i = 0; i < myHall.length; i++) {
      let roomName = ({ "Roomname and Customers Details" : myHall[i].roomName })
      listAllRooms.push(roomName)
      // console.log(listAllRooms)
      myHall[i].bookingDetails.forEach((bookingDetails) => {
        let bookingDetail = (bookingDetails)     
        listAllRooms.push(bookingDetail)
      })
    }
    return res.send(listAllRooms)
  } catch (error) {
    console.log(error)
  }
});


//4. list all customers with booked data 


hall.get("/listAllCustomers", (req, res) => {
  try {
    let listAllCustomers = []
    for (let i = 0; i < myHall.length; i++) {
      
      myHall[i].bookingDetails.forEach((bookingDetails) => {
        let bookingDetail = (bookingDetails)
        delete (bookingDetails.status)
        listAllCustomers.push(bookingDetail)
        let roomName = ({ "Your Room Name is": myHall[i].roomName })
      listAllCustomers.push(roomName)
      })
    }
    return res.send(listAllCustomers)
  } catch (error) {
    console.log(error)
  }

});

// Check server 


hall.get("/", (req, res) => {
  try {
    res.send(`Server Active`)
  } catch (error) {
    console.log(error)
  }
});

hall.listen(PORT,()=>console.log(`The server started in ${PORT}⭐⭐`));