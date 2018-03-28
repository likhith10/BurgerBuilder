import axios from 'axios';

const instance = axios.create( {
    baseURL:'https://burger-builder-fa6eb.firebaseio.com/'

});

export default instance;