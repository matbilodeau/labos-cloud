/*
Copyright 2018 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
removed unused code
Updated on 2020-11-07 matbilodeau
*/

const port = process.env.PORT || 3000
const upstream_uri = process.env.UPSTREAM_URI || 'http://worldclockapi.com/api/json/utc/now'
const service_name = process.env.SERVICE_NAME || 'test-1-v1'

const express = require('express')
const app = express()
const request = require('request-promise-native')

app.get('/', async(req, res) => {

	const begin = Date.now()

	let up
	try {
		up = await request({
			url: upstream_uri,
			headers: headers
		})
	} catch (error) {
		up = error
	}
	const timeSpent = (Date.now() - begin) / 1000 + "secs"

	res.end(`${service_name} - ${timeSpent}\n${upstream_uri} -> ${up}`)
})

app.listen(port, () => {
	console.log(`${service_name} listening on port ${port}!`)
})






}
