'use strict';

const logoutButton = new LogoutButton();

logoutButton.action = function() {
    ApiConnector.logout(function(response) {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(function(response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

function fetchRates() {
    ApiConnector.getStocks(function(response) {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

fetchRates();
setInterval(fetchRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Баланс успешно пополнен!');
        } else {
            moneyManager.setMessage(false, response.error || 'Ошибка пополнения баланса');
        }
    });
};

moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Валюта успешно конвертирована!');
        } else {
            moneyManager.setMessage(false, response.error || 'Ошибка конвертации валюты');
        }
    });
};

moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, 'Перевод выполнен успешно!');
        } else {
            moneyManager.setMessage(false, response.error || 'Ошибка перевода');
        }
    });
};

function updateFavoritesAndUsers() {
    ApiConnector.getFavorites(function(response) {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}

const favoritesWidget = new FavoritesWidget();

updateFavoritesAndUsers();

favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, function(response) {
        if (response.success) {
            updateFavoritesAndUsers();
            favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное!');
        } else {
            favoritesWidget.setMessage(false, response.error || 'Ошибка добавления пользователя');
        }
    });
};

favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, function(response) {
        if (response.success) {
            updateFavoritesAndUsers();
            favoritesWidget.setMessage(true, 'Пользователь удалён из избранного!');
        } else {
            favoritesWidget.setMessage(false, response.error || 'Ошибка удаления пользователя');
        }
    });
};