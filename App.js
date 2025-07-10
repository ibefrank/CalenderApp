import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, } from 'react-native';
export default function App() {
    const [days, setDays] = useState([]);
useEffect(() => {
generateCalendarDays();
}, []);
const generateCalendarDays = () => {
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const firstDay = new Date(year, month, 1).getDay(); // Weekday index
const totalDays = new Date(year, month + 1, 0).getDate(); // Last day of month
const dayArray = [];
// Add blank items for alignment
for (let i = 0; i < firstDay; i++) {
dayArray.push({ key: `blank-${i}`, label: '', isToday: false });
}
// Add real days
for (let i = 1; i <= totalDays; i++) {
    const isToday = i === today.getDate();
dayArray.push({ key: `day-${i}`, label: i.toString(), isToday });
}
setDays(dayArray);
};

return (
<View style={styles.container}>
{/* Header */}
<Text style={styles.header}>My Calendar</Text>
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
<View style={styles.dayCell}>
<Text style={[styles.dayText,item.isToday && styles.todayText]}>{item.label} </Text>
</View>
)}
/>
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
});