angular.module('bauhaus.role.controllers', ['bauhaus.role.services']);

angular.module('bauhaus.role.controllers').controller('RoleCtrl', ['$scope', '$location', 'Role',  function ($scope, $location, Role) {
    'use strict';

    $scope.roles = [];

    Role.query({}, function (result) {
        var roles = [];
        for (var u in result) {
            if (result[u]._id) {
                roles.push(result[u]);
            }
        }

        $scope.roles = roles;
    });

    $scope.createRole = function () {
        $location.path('role/new')
    }

}]);

angular.module('bauhaus.role.controllers').controller('RoleDetailCtrl', ['$scope', '$location', '$routeParams', 'Role', 'SharedRoles', function ($scope, $location, $routeParams, Role, SharedRoles) {
    'use strict';

    $scope.role = null;
    $scope.roleId = null;

    if ($routeParams.id && $routeParams.id != 'new') {
        $scope.roleId = $routeParams.id;
        // load role data for passed id
        Role.get({ roleId: $scope.roleId }, function (result) {
            if (result && result._id) {
                if (!result.permissions) {
                    result.permissions = {};
                }
                $scope.role = result;
            }
        });
    } else {
        $scope.role = {
            permissions: {}
        };
    } 

    $scope.isNew = function () {
        return ($scope.role && $scope.role._id) ? false : true;
    };

    $scope.updateRole = function () {
        // Save role if it already has an _id
        if ($scope.role._id) {
            Role.put($scope.role, function (result) {
            });
        } else {
            // create new role
            Role.create({}, function (result) {
                $scope.role._id = result._id;
                $scope.roleId =   result._id;

                Role.put($scope.role, function (result) {
                    SharedRoles.store.reload(function () {
                        $location.path('role/' + result._id);
                    });
                });
            })
        }
    };

    $scope.deleteRole = function () {
        var ok = confirm('Are you sure you want to delete Role "' + $scope.role.name + '"');
        if (ok) {
            Role.delete({}, {_id: $scope.role._id }, function (result) {
                SharedRoles.store.reload(function () {
                    $location.path('role');
                });
            });
        }
    }

    
}]);