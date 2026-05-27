import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

import pytest

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


@pytest.fixture
def driver():

    options = Options()

    options.add_argument("--disable-notifications")
    options.add_argument("--disable-save-password-bubble")
    options.add_argument("--disable-features=PasswordCheck")
    options.add_argument("--guest")

    options.add_experimental_option(
        "prefs",
        {
            "credentials_enable_service": False,
            "profile.password_manager_enabled": False,
            "profile.password_manager_leak_detection": False,
        },
    )

    driver = webdriver.Chrome(options=options)

    yield driver

    driver.quit()