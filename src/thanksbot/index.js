import Slack from 'slack-client';

import config from '../../config';
import {query} from '../lib/db';
import {deparse} from '../lib/slack';
import {get as getToken} from '../lib/token';

const bot = new Slack(getToken(config, 'thanksbot'), true, true);

bot.on('open', function() {
  console.log(`Connected to ${this.team.name} as @${this.self.name}`);
});

bot.on('message', function(message) {
  const channel = this.getChannelGroupOrDMByID(message.channel);
  const general = this.getChannelByName('general');
  const user = this.getUserByID(message.user);
  const subtype = message.subtype || 'normal';
  if (message.type === 'message' && channel.is_im) {
    if (message.subtype) {
      channel.send('Sorry, I don\'t understand '+message.subtype+' messages yet.');
      return;
    }
    query('insert_thanks', user.name, deparse(this, message.text)).then(function () {
      channel.send('Thanks, your message has been recorded for next Monday :tada:');
      general.send('Someone just left a message!');
    }.bind(this));
  }
});

export default bot;
