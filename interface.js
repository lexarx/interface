/*
 * Interface
 * 
 * Usage:
 * 
 * Interface.extend(interface1, interface2, ...)
 *
 * Example:
 * 
 * var ParentInterface = new Interface();
 * var ChildInterface = new Interface([
 *     ParentInterface
 * ]);
 * ChildInterface.addTo(Class);
 * 
 * var child = new Class();
 * ChildInterface.isImplementedBy(child) // true
 * ParentInterface.isImplementedBy(child) // true
 */
define('interface', [
	'class'
], function(Class) {	
	/**
	 * Checks if the provided value is an object.
	 * @param {*} value
	 * @returns {Boolean}
	 */
	function isObject(value) {
		return value !== null && (typeof value === 'object' || typeof value === 'function');
	}

	/**
	 * @class Interface
	 */
	return Class.extend({
		/**
		 * @constructor
		 * @param {Array<Interface>} [interfaces]
		 */
		constructor: function(interfaces) {
			this.interfaces = interfaces;
		},
		
		/**
		 * Marks the class as implementer of the interface.
		 * @param {Function} classConstructor
		 */
		addTo: function(classConstructor) {
			var prototype = classConstructor.prototype;
			var interfaces = prototype.__interfaces__;
			if (prototype.hasOwnProperty('__interfaces__')) {
				interfaces.push(this);
			} else {
				var newInterfaces = [this];
				if (interfaces === undefined) {
					interfaces = newInterfaces;
				} else {
					interfaces = interfaces.concat(newInterfaces);
				}
				prototype.__interfaces__ = interfaces;
			}
		},

	    /**
	 	 * Checks if specified object implements the interface
 		 * @param {Object} object
		 * @returns {Boolean}
		 */
		isImplementedBy: function(object) {
			if (!isObject(object)) {
				return false;
			}
			var interfaces = object.__interfaces__;
			if (interfaces === undefined) {
				return false;
			}
			for (var i = 0; i < interfaces.length; i++) {
				var iface = interfaces[i];
				if (iface === this || iface.contains(this)) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * @param {Interface} iface
		 * @returns {Boolean}
		 */
		contains: function(iface) {
			if (this.interfaces !== undefined) {
				for (var i = 0; i < this.interfaces.length; i++) {
					var localInterface = this.interfaces[i];
					if (localInterface === iface || localInterface.contains(iface)) {
						return true;
					}
				}
			}
			return false;
		}
	});
});