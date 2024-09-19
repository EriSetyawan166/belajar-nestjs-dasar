import { Injectable } from '@nestjs/common';

export class Connection {
    getName(): string {
        return null;
    }
}

@Injectable()
export class MySqlConnection extends Connection {
    getName(): string {
        return 'MySql';
    }
}

@Injectable()
export class MongoDBConnection extends Connection {
    getName(): string {
        return 'MongoDB'
    }
}
