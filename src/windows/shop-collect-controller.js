(function () {
    keylolApp.controller('ShopCollectController', [
        '$scope', 'close', 'window', '$http', 'apiEndpoint', 'notification', 'union', 'item', '$state',
        ($scope, close, window, $http, apiEndpoint, notification, union, item, $state) => {
            $scope.union = union;
            $scope.item = item;
            $scope.vm = {};
            if (item.Redeemed) {
                $scope.disabled = true;
                $scope.vm = item.Extra;
                for (let i = 0;i < item.AcceptedFields.length;i++) {
                    if (item.AcceptedFields[i].InputType === 'number') {
                        $scope.vm[item.AcceptedFields[i].Id] = parseInt($scope.vm[item.AcceptedFields[i].Id]);
                    }
                }
            }

            $scope.cancel = function () {
                close();
            };

            $scope.submitLock = false;
            $scope.submit = function () {
                if ($scope.submitLock || $scope.disabled) return;

                $scope.submitLock = true;
                $http.post(`${apiEndpoint}coupon-gift-order`, $scope.vm, {
                    params: { giftId: item.Id },
                }).then(() => {
                    close();
                    $state.reload();
                    notification.success('商品兑换成功，文券已被扣除。');
                }, response => {
                    if (response.status === 404) {
                        notification.error('指定文券礼品不存在');
                    } else {
                        notification.error('发生未知错误，请重试或与站务职员联系', response);
                    }
                    $scope.submitLock = false;
                });
            };
        },
    ]);
}());
