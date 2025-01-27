import react from 'react';
import { useNavigate }  from 'react-router-dom';

const Hostdashboard = () => {
    const [formData, setFormData] = useState({
        course_name: '',
        description: '',
        content: '',
        price: '',
});
const [message, setMesssage] = useState('');
const navigate = useNavigate();

const handleChange = (e) =>