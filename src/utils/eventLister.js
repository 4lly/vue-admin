function EventLister() {}

EventLister.prototype.resgiterEvent = function(eventName, callback) {
  this[eventName] = callback;
};

EventLister.prototype.onlyResgiterOneEvent = function(eventName, callback) {
  this[eventName] = callback;
  this.resgiterEventOneflag = true;
};
EventLister.prototype.emit = function(eventName, args) {
  this[eventName] && this[eventName](args);
  this.resgiterEventOneflag && this.unResgiterEvent(eventName);
};

EventLister.prototype.unResgiterEvent = function(eventName) {
  if (this[eventName]) {
    delete this[eventName];
  }
};

export default EventLister;
