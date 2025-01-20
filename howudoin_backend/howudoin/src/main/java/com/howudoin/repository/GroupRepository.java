package com.howudoin.repository;

import com.howudoin.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroupRepository extends MongoRepository<Group, String> {
    // No custom methods required at the moment; MongoRepository provides basic CRUD operations.
}