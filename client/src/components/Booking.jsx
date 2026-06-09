import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Alert, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '../styles/Booking.module.css';
import api from '../services/api';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const Booking = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [teeTimes, setTeeTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [players, setPlayers] = useState(1);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [refreshInterval] = useState(30000); // 30 second refresh
    const [lastUpdate, setLastUpdate] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [services, setServices] = useState({
        caddie_requested: false,
        cart_requested: false,
        equipment_rental: null
    });
    const [specialRequests, setSpecialRequests] = useState('');
    const [todaysTeeTimes, setTodaysTeeTimes] = useState([]);
    const [viewingToday, setViewingToday] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCourses();
    }, [navigate]);

    const fetchCourses = useCallback(async () => {
        try {
            const response = await api.get('/bookings/courses');
            if (response.data.success) {
                setCourses(response.data.courses);
                setLastUpdate(new Date());
            }
        } catch (error) {
            setMessage({ text: 'Failed to load courses', type: 'error' });
        }
    }, []);

    const handleSearch = async () => {
        if (!selectedCourse || !selectedDate) {
            setMessage({ text: 'Please select both course and date', type: 'error' });
            return;
        }

        try {
            const response = await api.get('/bookings/tee-times', {
                params: { 
                    courseId: selectedCourse, 
                    date: selectedDate,
                    timestamp: new Date().getTime()
                }
            });
            
            setTeeTimes(response.data.teeTimes.filter(t => t.available));
            setLastUpdate(new Date());
            
            if (response.data.teeTimes.length === 0) {
                setMessage({ text: 'No available tee times found', type: 'info' });
            } else {
                setMessage({ text: `Found ${response.data.teeTimes.length} available times`, type: 'success' });
            }
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Error fetching tee times', 
                type: 'error' 
            });
        }
    };

    const handleBooking = async () => {
        try {
            const response = await api.post('/bookings/book', {
                teeTimeId: selectedTime.id,
                players: players,
                ...services,
                special_requests: specialRequests
            });
            
            if (response.data.success) {
                setBookingConfirmed(true);
                setMessage({ text: 'Booking confirmed!', type: 'success' });
                setTimeout(() => navigate('/profile'), 2000);
            }
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Booking failed', 
                type: 'error' 
            });
        }
    };

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');
        
        ws.onopen = () => {
            console.log('WebSocket connected for bookings');
            setWsConnected(true);
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'booking_update' && selectedCourse && selectedDate) {
                handleSearch();
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setWsConnected(false);
        };
        
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setWsConnected(false);
        };

        return () => ws.close();
    }, [selectedCourse, selectedDate]);

    useEffect(() => {
        if (selectedCourse && selectedDate) {
            const intervalId = setInterval(handleSearch, refreshInterval);
            return () => clearInterval(intervalId);
        }
    }, [selectedCourse, selectedDate, refreshInterval]);

    const fetchTodaysTeeTimes = async () => {
        try {
            const response = await api.get('/bookings/today-tee-times', {
                params: { 
                    timestamp: new Date().getTime()
                }
            });
            
            if (response.data.success) {
                const availableTimes = response.data.teeTimes.filter(t => t.available);
                setTodaysTeeTimes(availableTimes);
                setViewingToday(true);
                setMessage({ 
                    text: availableTimes.length > 0 
                        ? `Found ${availableTimes.length} available times for today`
                        : 'No available tee times for today',
                    type: availableTimes.length > 0 ? 'success' : 'info'
                });
            }
        } catch (error) {
            setMessage({ 
                text: 'Error fetching today\'s tee times', 
                type: 'error' 
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className="text-center mb-4">
                <Typography variant="h2" gutterBottom>Reserve Your Tee Time</Typography>
                <div className="gold-text fw-semibold">PREMIUM BOOKING SERVICE</div>
            </div>

            <div className={styles.actionButtons}>
                <button 
                    className="btn btn-primary rounded-pill"
                    onClick={fetchTodaysTeeTimes}
                >
                    View Today's Available Times
                </button>
                {viewingToday && (
                    <button 
                        className="btn btn-outline-secondary rounded-pill"
                        onClick={() => setViewingToday(false)}
                    >
                        Back to Selection
                    </button>
                )}
            </div>

            {!viewingToday ? (
                <div className={styles.courseSelection}>
                    <div className={styles.searchHeader}>
                        <h3>Find Tee Times</h3>
                        {lastUpdate && (
                            <small className="text-muted">
                                Live {wsConnected ? <span className="text-success ms-1">●</span> : <span className="text-warning ms-1">○</span>}
                            </small>
                        )}
                    </div>
                    
                    <div className="row g-3">
                        <div className="col-md-6">
                            <FormControl fullWidth>
                                <InputLabel id="course-select-label" sx={{ color: 'var(--text-secondary)' }}>Select Course</InputLabel>
                                <Select
                                    labelId="course-select-label"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    label="Select Course"
                                    sx={{
                                        color: 'var(--text-primary)',
                                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--gold-accent)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--gold-accent)' }
                                    }}
                                >
                                    {courses.map(course => (
                                        <MenuItem key={course.id} value={course.id} sx={{ color: '#000000' }}>
                                            {course.name} ({course.holes} Holes)
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                type="date"
                                label="Select Date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    input: { color: 'var(--text-primary)' },
                                    label: { color: 'var(--text-secondary)' },
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-color)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--gold-accent)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--gold-accent)' }
                                }}
                            />
                        </div>
                    </div>

                    <button 
                        className="btn btn-primary rounded-pill align-self-start mt-3"
                        onClick={handleSearch}
                    >
                        Search Available Slots
                    </button>
                </div>
            ) : (
                <div className={styles.todaysTeeTimes}>
                    <h3>Available Tee Times for Today</h3>
                    
                    {todaysTeeTimes.length > 0 ? (
                        <div className={styles.teeTimeGrid}>
                            {todaysTeeTimes.map((time) => (
                                <div key={time.id} className={styles.teeTimeCard}>
                                    <div>
                                        <h4>{time.course_name}</h4>
                                        <p className="gold-text fw-semibold mt-1">{formatTime(time.time)}</p>
                                    </div>
                                    <button
                                        className="btn btn-primary rounded-pill w-100 mt-2"
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setViewingToday(false);
                                        }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Alert severity="info" sx={{ borderRadius: '12px' }}>
                            No available tee times for today
                        </Alert>
                    )}
                </div>
            )}

            {teeTimes.length > 0 && !viewingToday && (
                <div className={styles.teeTimesList}>
                    <h3>Available Slots</h3>
                    <div className={styles.teeTimeGrid}>
                        {teeTimes.map((time) => (
                            <div key={time.id} className={styles.teeTimeCard}>
                                <div>
                                    <h4>{time.course_name}</h4>
                                    <p className="mt-1">{formatDate(time.date)}</p>
                                    <p className="gold-text fw-bold mt-1">{formatTime(time.time)}</p>
                                </div>
                                <button
                                    className="btn btn-primary rounded-pill w-100 mt-2"
                                    onClick={() => setSelectedTime(time)}
                                >
                                    Select Slot
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTime && !bookingConfirmed && (
                <div className={styles.confirmationDetails}>
                    <h3>Confirm Booking</h3>
                    <p className="gold-text fw-semibold">
                        {selectedTime.course_name} — {formatDate(selectedTime.date)} at {formatTime(selectedTime.time)}
                    </p>
                    
                    <div className={styles.formSection}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Number of Players</label>
                                <select 
                                    className="form-select"
                                    value={players}
                                    onChange={(e) => setPlayers(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4].map(n => (
                                        <option key={n} value={n} style={{ color: '#000000' }}>{n} Player{n > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Add-on Services</label>
                                <div className={styles.servicesGroup}>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="caddieCheck"
                                            checked={services.caddie_requested}
                                            onChange={(e) => setServices({...services, caddie_requested: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="caddieCheck">
                                            Request Professional Caddie
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="cartCheck"
                                            checked={services.cart_requested}
                                            onChange={(e) => setServices({...services, cart_requested: e.target.checked})}
                                        />
                                        <label className="form-check-label" htmlFor="cartCheck">
                                            Reserve Golf Cart
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="equipmentCheck"
                                            checked={Boolean(services.equipment_rental)}
                                            onChange={(e) => setServices({...services, equipment_rental: e.target.checked ? {} : null})}
                                        />
                                        <label className="form-check-label" htmlFor="equipmentCheck">
                                            Elite Golf Club Rental
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="form-label fw-semibold">Special Requests / Concierge Notes</label>
                            <textarea 
                                className="form-control"
                                rows={3}
                                placeholder="Dietary restrictions, caddie preferences, handicap details, etc."
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary rounded-pill align-self-start mt-3"
                            onClick={handleBooking}
                        >
                            Finalize Booking
                        </button>
                    </div>
                </div>
            )}

            {message.text && (
                <Alert severity={message.type} sx={{ mt: 3, borderRadius: '12px' }}>
                    {message.text}
                </Alert>
            )}
        </div>
    );
};

export default Booking;