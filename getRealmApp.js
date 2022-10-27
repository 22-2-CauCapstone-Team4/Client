import Realm from 'realm';

let app;
export function getRealmApp() {
  if (app === undefined) {
    const id = 'realm-ugdee';
    const config = {
      id,
      timeout: 10000,
    };
    app = new Realm.App(config);
  }
  return app;
}
