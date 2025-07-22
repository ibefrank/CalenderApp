import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
// Importing necessary components from React and React Native
// This is a simple calendar app that displays the current month and allows navigation between months
// It uses FlatList to render the days of the month in a grid format

export default function App() {
   const [days, setDays] = useState([]);
const [currentDate, setCurrentDate] = useState(new Date()); // State to hold the current date
useEffect(() => {
generateCalendarDays();
loadEvents();
}, [currentDate]);
// Function to generate the calendar days based on the current date
// It calculates the first day of the month, total days in the month, and fills the
const generateCalendarDays = () => {
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const today = new Date();
const firstDay = new Date(year, month, 1).getDay();
const totalDays = new Date(year, month + 1, 0).getDate();
const dayArray = [];
for (let i = 0; i < firstDay; i++) {
dayArray.push({ key: `blank-${i}`, label: '', isToday: false });
}
for (let i = 1; i <= totalDays; i++) {
const isToday =
i === today.getDate() &&
month === today.getMonth() &&
year === today.getFullYear();
dayArray.push({ key: `day-${i}`, label: i.toString(), isToday });
}
setDays(dayArray);
};

// Functions to navigate to the previous and next month

const goToPreviousMonth = () => {
const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
setCurrentDate(newDate);
};
const goToNextMonth = () => {
const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
setCurrentDate(newDate);
};

const [selectedDay, setSelectedDay] = useState(null);

const [events, setEvents] = useState({});
const [modalVisible, setModalVisible] = useState(false);
const [note, setNote] = useState('');

const loadEvents = async () => {
try {
const saved = await AsyncStorage.getItem('calendarEvents');
if (saved) {
setEvents(JSON.parse(saved));
}
} catch (e) {
console.error('Failed to load events:', e);
}
};

return (
<View style={styles.container}>
{/* Header */}
<Text style={styles.header}>My Calendar</Text>
<View style={styles.headerRow}>
<Text style={styles.navButton} onPress={goToPreviousMonth}>{'<'}</Text>
<Text style={styles.header}>
{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
</Text>
<Text style={styles.navButton} onPress={goToNextMonth}>{'>'}</Text>
</View>
{/* Weekday Labels */}
<View style={styles.weekRow}>
{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
<Text key={index} style={styles.dayLabel}>{day}</Text>
))}
</View>
{/* Placeholder */}
<FlatList
data={days}
numColumns={7}
renderItem={({ item }) => (
<TouchableOpacity
style={styles.dayCell}
disabled={!item.label}
onPress={() => {
const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(item.label));
setSelectedDay(date);
setNote(events[date.toDateString()] || '');
setModalVisible(true);
}}
>
 <Text
style={[
styles.dayText,
item.isToday && styles.todayText,
selectedDay &&
selectedDay.getDate() === parseInt(item.label) &&
selectedDay.getMonth() === currentDate.getMonth() &&
selectedDay.getFullYear() === currentDate.getFullYear() &&
styles.selectedText,
]}
>
{item.label}
</Text>
</TouchableOpacity>
)}
/>
<Modal visible={modalVisible} animationType="slide" transparent={true}>
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
Add Event for {selectedDay?.toDateString()}
</Text>
<TextInput
placeholder="Type your note here"
value={note}
onChangeText={setNote}
style={styles.input}
/>
<Button
title="Save"
onPress={async () => {
const newEvents = { ...events, [selectedDay.toDateString()]: note };
setEvents(newEvents);
await AsyncStorage.setItem('calendarEvents', JSON.stringify(newEvents));
setModalVisible(false);
}}
/>
<Button
title="Cancel"
onPress={() => setModalVisible(false)}
color="gray"
/>
</View>
</View>
</Modal>
{selectedDay && (
<View style={styles.selectedInfo}>
<Text style={styles.infoText}>
You selected: {selectedDay.toDateString()}
</Text>
{events[selectedDay.toDateString()] && (
<Text style={{ color: '#333', marginTop: 5 }}>
Event: {events[selectedDay.toDateString()]}
</Text>
)}
</View>
)}
</View>

);

}
const styles = StyleSheet.create({
container: {
paddingTop: 60,
paddingHorizontal: 15,
backgroundColor: '#fff',
flex: 1,
},
header: {
fontSize: 26,
fontWeight: 'bold',
textAlign: 'center',
marginBottom: 20,
},
weekRow: {
flexDirection: 'row',justifyContent: 'space-between',
marginBottom: 10,
},
dayLabel: {
width: '13%',
textAlign: 'center',
fontWeight: '600',
color: 'light blue',
},

dayCell: {
width: '14.2%',
aspectRatio: 1,
justifyContent: 'center',
alignItems: 'center',
margin: 1,
},
dayText: {
fontSize: 16,
color: '#333',
},
todayText: {
color: 'blue',
fontWeight: 'bold',
fontSize: 17,
},
headerRow: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 10,
},
navButton: {
fontSize: 24,
fontWeight: 'bold',
paddingHorizontal: 10,
color: '#007AFF',
},
selectedText: {
backgroundColor: '#007AFF',
color: '#fff',
borderRadius: 15,
paddingHorizontal: 6,
paddingVertical: 2,
},
selectedInfo: {
marginTop: 15,
alignItems: 'center',
},
infoText: {
fontSize: 16,
color: '#007AFF',
fontStyle: 'italic',
},
modalOverlay: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: 'rgba(0,0,0,0.3)',
},
modalContent: {
backgroundColor: 'white',padding: 20,
borderRadius: 10,
width: '85%',
elevation: 5,
},
input: {
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 5,
padding: 10,
marginBottom: 10,
width: '100%',
},
});