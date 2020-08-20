export let EndPoint = (flag?): string => {
  const host = window.location.hostname;
  if (flag === 'socket') {
    if (host && host.match(/localhost/i)) {
      return 'ws://localhost:8888';
    } else {
      return 'wss://localhost:8888';
    }
  } else {
    if (host && host.match(/localhost/i)) {
      return 'http://localhost:8888/api/';
    }  else {
      return 'http://localhost:8888/api/';
    }
  }
};

