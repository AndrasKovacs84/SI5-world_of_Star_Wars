from .server_connection.connect import connect_to_sql


@connect_to_sql
def insert_vote(cursor, planet_id, username, submission_time):
    statement = """ INSERT INTO planet_votes
                    (planet_id, user_id, submission_time)
                    VALUES (%s, (SELECT id
                                FROM sw_users
                                WHERE username=%s), %s); """
    cursor.execute(statement, (planet_id, username, submission_time))


@connect_to_sql
def insert_user(cursor, username, password):
    statement = """ INSERT INTO sw_users
                    (username, password)
                    VALUES (%s, %s); """
    cursor.execute(statement, (username, password))


@connect_to_sql
def check_credentials(cursor, username, password):
    statement = """
                SELECT username, password
                FROM sw_users
                WHERE username = %s AND password = %s
                """
    cursor.execute(statement, (username, password))
    result = cursor.fetchall()
    if result == []:
        return False
    else:
        return True
