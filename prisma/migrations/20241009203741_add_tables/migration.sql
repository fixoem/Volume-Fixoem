-- CreateTable
CREATE TABLE `Promoo` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `promoType` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromooProduct` (
    `id` INTEGER NOT NULL,
    `proomoId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProomoRule` (
    `id` INTEGER NOT NULL,
    `proomoId` INTEGER NOT NULL,
    `ruleMinStock` INTEGER NOT NULL,
    `rulePercent` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PromooProduct` ADD CONSTRAINT `PromooProduct_proomoId_fkey` FOREIGN KEY (`proomoId`) REFERENCES `Promoo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProomoRule` ADD CONSTRAINT `ProomoRule_proomoId_fkey` FOREIGN KEY (`proomoId`) REFERENCES `Promoo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
