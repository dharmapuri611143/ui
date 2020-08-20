/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
interface JQuery {
  owlCarousel(options?: any, callback?: Function) : any;
}