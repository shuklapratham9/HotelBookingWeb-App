let currentHotelData = null;

        document.addEventListener('DOMContentLoaded', () => {
            checkLoginStatus();
            console.log('Checking login status...');
        });


        async function isUserLoggedIn() {
            try {
                const response = await fetch('http://localhost:3000/auth/status', {
                    method: 'GET',
                    credentials: "include"
                });
                const data = await response.json();
                return data.isLoggedIn;
            } catch (error) {
                console.error('Error checking login status:', error);
                return false;
            }
        }

        async function checkLoginStatus() {
            try {
                const response = await fetch('http://localhost:3000/auth/status', {
                    method: 'GET',
                    credentials:'include'
                });
                const data = await response.json();
                console.log(data)
                console.log('Login status response:', data);
                updateLoginButtons(data.isLoggedIn);
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        }

        function updateLoginButtons(isLoggedIn) {
            const loginButton = document.querySelector('.auth-buttons button:first-child');
            const logoutButton = document.querySelector('.auth-buttons .logout-btn');
            
            if (isLoggedIn) {
                loginButton.style.display = 'none';
                logoutButton.style.display = 'inline-block';
            } else {
                loginButton.style.display = 'inline-block';
                logoutButton.style.display = 'none';
            }
        }

        function showLoginModal() {
            document.getElementById('loginModal').style.display = 'flex';
        }

        async function handleGoogleLogin() {
            try {
                const response = await fetch('http://localhost:3000/auth/google', {
                    method: 'GET',
                    credentials:'include'
                });
                const data = await response.json();
                console.log('Google login response:', data);
                document.getElementById('loginModal').style.display = 'none';
                updateLoginButtons(true);
            } catch (error) {
                console.error('Error during Google login:', error);
                showMessage('Login failed. Please try again.', 'error');
            }
        }

        async function showMessage(message, type = 'success') {
            const popup = document.getElementById('messagePopup');
            popup.textContent = message;
            popup.className = `message-popup ${type}`;
            popup.style.display = 'block';
            
            //slideIn animation
            popup.style.animation = 'slideIn 0.5s ease-out';
            
            //start sliding out
            setTimeout(() => {
                popup.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 500);
            }, 3000);
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }

        async function searchHotels() {
            const loggedIn = await isUserLoggedIn();
            if (!loggedIn) {
                showMessage('Please login first to search hotels', 'error');
                showLoginModal();
                return;
            }

            const location = document.getElementById('location').value;
            const formattedLocation = capitalizeFirstLetter(location);

            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
        showMessage('Please select both check-in and check-out dates', 'error');
        return;
        }

        if (new Date(endDate) < new Date(startDate)) {
        showMessage('Please enter correct dates', 'error');
        return;
         }            
        try {
                const response = await fetch(`http://localhost:3000/hotels/location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({location: formattedLocation})
                });

                const data = await response.json();
                console.log('Hotels search response:', data);
                const hotels = data.hotels || data.data || data;
                displayHotels(Array.isArray(hotels) ? hotels : [hotels]);
            } catch (error) {
                console.error('Error fetching hotels:', error);
                showMessage('Error fetching hotels', 'error');
            }
        }

        function displayHotels(hotels) {
            const container = document.getElementById('hotelsContainer');
            container.innerHTML = '';

            if (!hotels || hotels.length === 0) {
                container.innerHTML = '<p>No hotels found</p>';
                return;
            }

            hotels.forEach(hotel => {
                const card = document.createElement('div');
                card.className = 'hotel-card';
                card.innerHTML = `
                    <img src="${hotel.url}" alt="${hotel.name}" class="hotel-image">
                    <div class="hotel-info">
                        <h3>${hotel.name}</h3>
                        <p>${hotel.location}</p>
                        <p>${hotel.email}</p>
                        <p>₹${hotel.costPerRoom} per night</p>
                        <button class="view-rooms-btn" onclick='viewRooms(${JSON.stringify(hotel)})'>View Rooms</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        async function getUserEmail() {
            try {
                const response = await fetch('http://localhost:3000/auth/useremail', {
                    method: 'GET',
                });
                const data = await response.json();
                if (!data.email) {
                    throw new Error('User email not found');
                }
                return data.email;
            } catch (error) {
                console.error('Error fetching user email:', error);
                showMessage('Please login first', 'error');
                showLoginModal();
                throw error;
            }
        }

        async function viewRooms(hotelData) {
           
            const loggedIn = await isUserLoggedIn();
            if (!loggedIn) {
                showMessage('Please login first to view rooms', 'error');
                showLoginModal();
                return;
            }

            currentHotelData = hotelData;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            if (!startDate || !endDate) {
                showMessage('Please select check-in and check-out dates', 'error');
                return;
            }

            try {
                const requestData = {
                    ...hotelData,
                    from: new Date(startDate).toISOString(),
                    to: new Date(endDate).toISOString()
                };

                console.log('Sending request with data:', requestData);

                const response = await fetch('http://localhost:3000/hotels/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                
                const data = await response.json();
                console.log('Rooms response:', data);
                if(data.rooms.length === 0) {
                    showMessage('Currently no room is available in this hotel');
                }
                
                if (data && data.rooms) {
                    displayRooms(data.rooms);
                } else {
                    console.error('Invalid response format:', data);
                    showMessage('Error fetching rooms data', 'error');
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
                showMessage('Error fetching rooms data', 'error');
            }
        }

        function displayRooms(rooms) {
            const tableBody = document.getElementById('roomsTableBody');
            tableBody.innerHTML = '';

            if (!rooms || rooms.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3">No rooms available</td></tr>';
                document.getElementById('roomsModal').style.display = 'flex';
                return;
            }

            rooms.forEach(room => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.roomId}</td>
                    <td>₹${room.cost}</td>
                    <td>
                        <button class="book-room-btn" onclick="bookRoom('${room.roomId}')">
                            Book Now
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.getElementById('roomsModal').style.display = 'flex';
        }

        function closeRoomsModal() {
            document.getElementById('roomsModal').style.display = 'none';
        }

        async function bookRoom(roomId) {
         
            const loggedIn = await isUserLoggedIn();
            if (!loggedIn) {
                showMessage('Please login first to book a room', 'error');
                showLoginModal();
                return;
            }

            try {
                const email = await getUserEmail();
                
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                if (!startDate || !endDate) {
                    showMessage('Please select check-in and check-out dates', 'error');
                    return;
                }

                if (!currentHotelData) {
                    showMessage('Hotel data not found','error');
                    return;
                }

                const bookingData = {
                    hotelId: currentHotelData._id,
                    roomId: roomId,
                    from: new Date(startDate).toISOString(),
                    to: new Date(endDate).toISOString(),
                    email: email
                };

                console.log('Sending booking request:', bookingData);

                const response = await fetch('http://localhost:3000/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });

                const data = await response.json();
                
                showMessage(data.message||'Booking successful!','success');
                
                setTimeout(() => {
                    closeRoomsModal();
                }, 3000);
                
            } catch (error) {
                console.error('Error during booking:', error);
                showMessage('Booking failed. Please try again.','error');
            }
        }
      
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('open');
    if (sideMenu.classList.contains('open')) {
        fetchLastBooking();
    }
}

async function fetchLastBooking() {
    try {
        
        const loggedIn = await isUserLoggedIn();
        if (!loggedIn) {
            showMessage('Please login to view last booking', 'error');
            showLoginModal();
            return;
        }

        const response=await fetch('http://localhost:3000/user/lastbooking', {
            method:'GET',
            credentials:'include'
        });

        const data = await response.json();

        if (data.name) {
            displayLastBooking(data);
        } else {
            document.getElementById('lastBookingDetails').innerHTML='<p>No previous bookings found</p>';
            document.getElementById('cancelBookingBtn').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching last booking:', error);
        showMessage('Error fetching last booking', 'error');
    }
}

function displayLastBooking(bookingData) {
    const container = document.getElementById('lastBookingDetails');
    const from = new Date(bookingData.bookingDates.from).toLocaleDateString();
    const to = new Date(bookingData.bookingDates.to).toLocaleDateString();

    console.log(bookingData.name)
    container.innerHTML = `
        <h3>Booking Details</h3>
        <p><strong>Hotel:</strong> ${bookingData?bookingData.name:'Unknown Hotel'}</p>
        <p><strong>Room ID:</strong> ${bookingData.currentlyBookedRoom}</p>
        <p><strong>Check-in:</strong> ${from}</p>
        <p><strong>Check-out:</strong> ${to}</p>
    `;
    
    document.getElementById('cancelBookingBtn').style.display = 'block';
}

async function cancelLastBooking() {
    try {
        const response = await fetch('http://localhost:3000/user/cancel', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        showMessage(data.message, 'success');
        
        //clear booking details and hide cancel button
        document.getElementById('lastBookingDetails').innerHTML = '<p>No previous bookings found</p>';
        document.getElementById('cancelBookingBtn').style.display = 'none';
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showMessage('Error cancelling booking', 'error');
    }
}

async function isUserLoggedIn() {
    try {
        const response = await fetch('http://localhost:3000/auth/status', {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        updateLoginButtons(data.isLoggedIn);
        return data.isLoggedIn;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}