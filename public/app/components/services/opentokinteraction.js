/**
 * Created by Chris on 11/29/2016.
 */
angular.module('angularMaterialAdmin')
    .service('opentokinteraction', function ($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            generate_session: function () {
                return $http.get('/api/create_session');
            },
        }
    });
