import os
from datetime import timedelta
from typing import NamedTuple


def default_db_file(suffix):
    return f'sqlite:///local_dbs/db_{suffix}.db'


class AppConfig(NamedTuple):
    ENVIRONMENT: str
    SQLALCHEMY_DATABASE_URI: str
    SECRET_KEY: str
    DEBUG: bool = False
    TESTING: bool = False


def get_config(environment) -> AppConfig:
    if environment == 'testing':
        return AppConfig(
            ENVIRONMENT='testing',
            SECRET_KEY='TEST_SECRET',
            TESTING=True,
            DEBUG=True,
            SQLALCHEMY_DATABASE_URI=os.getenv(
                'DATABASE_URL', default_db_file(environment)),
        )
    if environment == 'development':
        print(
            f"Using database URI: {os.getenv('DATABASE_URL', default_db_file(environment))}")

        return AppConfig(
            ENVIRONMENT='development',
            SECRET_KEY=os.getenv('SECRET_KEY', 'DEV_SECRET'),
            DEBUG=False,
            SQLALCHEMY_DATABASE_URI='sqlite:///C:/Users/krylo/Desktop/lokey zadanie/recruitment_task/connexion-example/local_dbs/db_development.db'
        )
    if environment == 'production':
        return AppConfig(
            ENVIRONMENT='production',
            SECRET_KEY=os.environ['SECRET_KEY'],
            DEBUG=False,
            TESTING=False,
            SQLALCHEMY_DATABASE_URI=os.environ['DATABASE_URL'],
        )

    raise EnvironmentError(
        f'Unknown enviroment type {environment} in APP_SETTINGS env var')


CONFIG = get_config(os.getenv(
    'APP_SETTINGS',
    'development'
))
