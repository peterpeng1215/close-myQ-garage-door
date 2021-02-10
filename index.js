import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { default as MyQ } from 'myq-api';

let config = yaml.load(fs.readFileSync('./config.yml', 'utf8'))

const EMAIL = config.email || process.env.email;
const PASSWORD = config.password || process.env.password;

const account = new MyQ();


(async () => {
  let loginResult = await account.login(EMAIL, PASSWORD);
  const { devices } =await account.getDevices()
  const doors = devices.filter(d => d.device_family =='garagedoor')
  doors.forEach(async (door) => {
    
      let {deviceState} = await account.getDoorState(door.serial_number)
      if (deviceState !=  'closed') {
        console.log(`${door.name} is open, closing`)
        await account.setDoorState(door.serial_number, MyQ.actions.door.CLOSE)
        let r = await account.getDoorState(door.serial_number)
        console.log(`${door.name} state is ${r.deviceState}`)
      } else {
        console.log(`${door.name} is closed`)
      }
      // console.log(door.name,await account.getDoorState(door.serial_number))

    
     

  })

})();