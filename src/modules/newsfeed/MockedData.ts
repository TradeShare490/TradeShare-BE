export class MockedData {
	static getAllPosts () {
		const data = [{
			id: 312,
			image: 'https://randomuser.me/api/portraits/men/35.jpg',
			name: 'Ash Britain',
			username: '@ashcoin63',
			when: '10min ago',
			purchased: true,
			company: 'Twitter Inc.',
			tag: 'TWTR',
			size: 50,
			verified: false,
			stock1: 312.92,
			stock2: '+0.52%',
			stock3: 311.7,
			stock4: 'Post+0.16%'
		},
		{
			id: 313,
			image: 'https://randomuser.me/api/portraits/men/52.jpg',
			name: 'Tim Robenman',
			username: '@timthetatman',
			when: '18h ago',
			purchased: false,
			company: 'NVIDIA Corp.',
			tag: 'NVDA',
			size: 150,
			verified: true,
			stock1: 222.42,
			stock2: '+0.41%',
			stock3: 222.7,
			stock4: 'Post+0.13%'
		},
		{
			id: 329,
			image: 'https://randomuser.me/api/portraits/men/86.jpg',
			name: 'Mac Kafe',
			username: '@mcafeez',
			when: 'Dec 10',
			purchased: true,
			company: 'Tesla Inc.',
			tag: 'TSLA',
			size: 1000,
			verified: true,
			stock1: 755.83,
			stock2: '+1.52%',
			stock3: 755.1,
			stock4: 'Post+0.91%'
		},
		{
			id: 331,
			image: 'https://randomuser.me/api/portraits/men/35.jpg',
			name: 'Ash Britain',
			username: '@ashcoin63',
			when: 'Dec 8',
			purchased: false,
			company: 'Voyager Digital Ltd.',
			tag: 'VYGR',
			size: 15,
			verified: false,
			stock1: 14.98,
			stock2: '-0.25%',
			stock3: 15.04,
			stock4: 'Post+0.19%'
		},
		{
			id: 334,
			image: 'https://randomuser.me/api/portraits/men/52.jpg',
			name: 'Tim Robenman',
			username: '@timthetatman',
			when: 'Nov 29',
			purchased: false,
			company: 'NVIDIA Corp.',
			tag: 'NVDA',
			size: 150,
			verified: true,
			stock1: 222.42,
			stock2: '+0.41%',
			stock3: 222.7,
			stock4: 'Post+0.13%'
		}
		]
		return data
	}
}
