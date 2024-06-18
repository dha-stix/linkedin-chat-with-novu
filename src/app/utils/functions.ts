import { formatDistance } from 'date-fns'
import { Timestamp } from 'firebase/firestore';

export const generateID = () => Math.random().toString(36).substring(2, 10);

export const getDatePosted = (timestamp: Timestamp) => {
    if(timestamp === null) return;
	const date = timestamp.toDate();
	const mm = date.getMonth();
	const dd = date.getDate();
    const yyyy = date.getFullYear();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();

    const result = formatDistance(new Date(yyyy, mm, dd, hrs, mins, secs), Date.now(), {
        addSuffix: true, includeSeconds: true
    })

	return result;
}