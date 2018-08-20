import './vendor';
import createField from './vendor/create-field';

var app = new Vue({
	el: '#app',
	data: {
		userField: createField()
	}
});